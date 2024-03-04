import express  from "express";
import { registerCustomer, loginCustomer, orderHistory, addAddressToCustomer, updateAddress, deleteAddress } from "../controllers/customerController.js";
import { requireSignIn, requireAdmin } from "../middlewares/authenticationMiddleware.js";
const router = express.Router();

router.route('/register').post(registerCustomer);
router.route('/login').post(loginCustomer);
router.route('/history').get(requireSignIn, orderHistory);
router.route('/addAddress').post(requireSignIn, addAddressToCustomer);
router.route('/updateAddress/:addressId').put(requireSignIn, updateAddress);
router.route('/deleteAddress/:addressId').delete(requireSignIn, deleteAddress);

export default router;

