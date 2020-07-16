const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs"); // for accessing paths

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          err: "NO Product Found",
        });
      }
      req.product = product;

      next();
    });
};

exports.createProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        err: "Problem with Image",
      });
    }

    ///Destructing the fields
    const { name, description, price, category, stock } = fields;

    console.log(fields);
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        err: "Please include all fields",
      });
    }

    let product = new Product(fields);

    //handle files here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          err: "File size exceeded",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          err: "Saving tshirt to DB failed",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

//middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }

  next();
};

exports.updateProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        err: "Problem with Image",
      });
    }

    //updation code
    let product = req.product;
    product = _.extend(product, fields);
    //handle files here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          err: "File size exceeded",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          err: "updation of product failed",
        });
      }
      res.json(product);
    });
  });
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        err: "Product Deletion Unsuccessful",
      });
    }
    return res.json({
      msg: "Production deletion successful",
      deletedProduct,
    });
  });
};

//products listing
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "price";
  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        res.json({
          err: "No Products Found",
        });
      }
      res.send(products);
    });
};

//updating stock

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        err: "Bulk Operations failed",
      });
    }
  });
  next();
};

//getting all categories

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        err: "No category found",
      });
    }
    res.json(category);
  });
};
