const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");

const {
  getOrderById,
  createOrder,
  getAllOrders,
  updateStatus,
  getOrderStatus,
  removeOrder,
  getOrder,
} = require("../controllers/order");

//params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//actual routes

//create
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);

//get order

router.get("/order/:orderId", getOrder);

//read
router.get(
  "/order/all/:userId",

  getAllOrders
);

//order status

router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);

//update status
router.put(
  "/order/:orderId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateStatus
);

//delete order

router.delete(
  "/order/:orderId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeOrder
);

module.exports = router;
