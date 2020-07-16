const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken"); // for creating token
var expressJwt = require("express-jwt"); // for validating JWT
require("dotenv").config("..");

exports.signup = (req, res) => {
  // for validating if any error is present in request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  //saving user into database
  const user = new User(req.body);

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save user in DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  User.findOne({ email }, (error, user) => {
    if (error || !user) {
      return res.status(404).json({
        error: "User email does not exist",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "password didn't match",
      });
    }
    //creating a token
    var token = jwt.sign({ id: user._id }, process.env.SECRET);

    //put token into cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //sending response to frontend
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: {
        _id,
        name,
        email,
        role,
      },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Signout Succesful for user",
  });
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let check = req.profile && req.auth && req.profile._id == req.auth.id;
  if (!check) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "U are not an admin ACCESS DENIED",
    });
  }

  next();
};
