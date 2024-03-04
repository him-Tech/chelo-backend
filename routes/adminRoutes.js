import express  from "express";
import { registerAdmin, loginAdmin, getCustomerData, getAllCustomersOnPlatform, getAllOrdersOnPlatform, updateOrderStatus } from "../controllers/adminController.js";
import { requireAdmin, requireSignIn } from "../middlewares/authenticationMiddleware.js";
const router = express.Router();

router.route('/register').post(registerAdmin);
router.route('/login').post(loginAdmin);
router.route('/allCustomers').get(requireSignIn, requireAdmin, getAllCustomersOnPlatform);
router.route('/singleCustomer/:customerId').get(requireSignIn, requireAdmin, getCustomerData);
router.route("/allOrders").get(requireSignIn, requireAdmin, getAllOrdersOnPlatform);
router.route("/update/:orderId").put(requireSignIn, requireAdmin, updateOrderStatus);

export default router;