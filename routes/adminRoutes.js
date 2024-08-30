import express  from "express";
import { registerAdmin, 
    loginAdmin, 
    getCustomerData, 
    getAllCustomersOnPlatform, 
    getAllOrdersOnPlatform, 
    updatePassword, 
    updateEmail, 
    updateOrderStatus, 
    deleteCustomer, 
    adminData, getAllReviews, deleteReviewsAsAdmin } 
    from "../controllers/adminController.js";

import { requireAdmin, requireSignIn } from "../middlewares/authenticationMiddleware.js";
import { sendCustomerEmail, sendDeliveryUpdateEmail } from "../controllers/emailController.js";
const router = express.Router();

router.route('/register').post(registerAdmin);
router.route('/login').post(loginAdmin);
router.route('/allCustomers').get(requireSignIn, requireAdmin, getAllCustomersOnPlatform);
router.route('/singleCustomer/:customerId').get(requireSignIn, requireAdmin, getCustomerData);
router.route("/allOrders").get(requireSignIn, requireAdmin, getAllOrdersOnPlatform);
router.route("/update/:orderId").put(requireSignIn, requireAdmin, updateOrderStatus);
router.route("/deleteCustomer/:customerId").delete(requireSignIn, requireAdmin, deleteCustomer);
router.route("/sendEmail").post(requireSignIn, requireAdmin, sendCustomerEmail);
router.route("/deliveryUpdateEmail").post(requireSignIn, requireAdmin, sendDeliveryUpdateEmail);
router.route('/updatePassword').put(requireSignIn, requireAdmin, updatePassword);
router.route('/updateEmail').put(requireSignIn, requireAdmin, updateEmail);
router.route('/profile').get(requireSignIn, requireAdmin, adminData);
router.route('/allReviews').get(requireSignIn, requireAdmin, getAllReviews);
router.route("/deleteReview/:reviewId").delete(requireSignIn, requireAdmin, deleteReviewsAsAdmin);

export default router;