import express  from "express";
import { registerAdmin, loginAdmin, getCustomerData, getAllCustomersOnPlatform, getAllOrdersOnPlatform, updateOrderStatus, deleteCustomer } from "../controllers/adminController.js";
import { requireAdmin, requireSignIn } from "../middlewares/authenticationMiddleware.js";
import { sendCustomerEmail } from "../controllers/emailController.js";
const router = express.Router();

router.route('/register').post(registerAdmin);
router.route('/login').post(loginAdmin);
router.route('/allCustomers').get(requireSignIn, requireAdmin, getAllCustomersOnPlatform);
router.route('/singleCustomer/:customerId').get(requireSignIn, requireAdmin, getCustomerData);
router.route("/allOrders").get(requireSignIn, requireAdmin, getAllOrdersOnPlatform);
router.route("/update/:orderId").put(requireSignIn, requireAdmin, updateOrderStatus);
router.route("/deleteCustomer/:customerId").delete(requireSignIn, requireAdmin, deleteCustomer);
router.route("/sendEmail").post(requireSignIn, requireAdmin, sendCustomerEmail);

export default router;