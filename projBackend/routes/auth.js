var express = require("express");
var router = express.Router();
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const { check, validationResult } = require("express-validator");

const { body } = require("express-validator");
const User = require("../models/user");

// creating a route and providing a check for data
router.post(
  "/signup",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("Name should be atleast 3 characters"),
    check("email").isEmail().withMessage("Not a valid email"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("password should be atleast 6 characters"),
  ],
  signup
);
router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("valid email required"),
    check("password").isLength({ min: 1 }).withMessage("password required"),
  ],
  signin
);

router.get("/signout", signout);

router.get("/testroute", isSignedIn, (req, res) => {
  res.json(req.auth);
});

module.exports = router;
