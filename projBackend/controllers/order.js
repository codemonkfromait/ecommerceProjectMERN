const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          err: "Oops no order found",
        });
      }
      req.order = order;
      next();
    });
};

//creating an order
exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  let order = new Order(req.body.order);

  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        err: "Unable to save order in DB",
      });
    }

    res.json(order);
  });
};

//get an order

exports.getOrder = (req, res) => {
  return req.order;
};

//getting all orders
exports.getAllOrders = (req, res) => {
  console.log("HELOO ji HELLOO");
  Order.find()
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          err: "No orders found",
        });
      }
      return res.json(order);
    });
};

//updating order of status

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.order._id },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.json({
          err: "Failed to  update order status",
        });
      }
      res.json(order);
    }
  );
};

//getting the status of order for customers

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

//removing an order
exports.removeOrder = (req, res) => {
  req.order.remove((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete this category",
      });
    }
    return res.json({
      msg: `Sucessfully deleted ${order.name} category`,
    });
  });
};
