import express from "express";
import {
  createOrder,
  getOrderDetails,
  deleteOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { requireSignIn, requireAdmin } from "../middlewares/authenticationMiddleware.js";
const router = express.Router();

router.route("/create").post(requireSignIn, createOrder);
router.route("/details/:orderId").get(requireSignIn, getOrderDetails);
router.route("/delete/:orderId").delete(requireSignIn, deleteOrder);
router.route("/update/:orderId").put(requireSignIn, requireAdmin, updateOrderStatus);

export default router;
