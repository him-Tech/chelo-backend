import express from "express";
import {
  createOrder,
  getOrderDetails,
  deleteOrder,
} from "../controllers/orderController.js";
import { requireSignIn, requireAdmin } from "../middlewares/authenticationMiddleware.js";
const router = express.Router();

router.route("/create").post(requireSignIn, createOrder);
router.route("/details/:orderId").get(requireSignIn, getOrderDetails);
router.route("/delete/:orderId").delete(requireSignIn, deleteOrder);

export default router;
