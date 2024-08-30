import express from "express";
import {
  addProduct,
  getAllProductDetails,
  getSingleProductDetails,
  updateProductData,
  deleteProduct,
  addReview,
  deleteReview
} from "../controllers/productController.js";
import { requireSignIn, requireAdmin } from "../middlewares/authenticationMiddleware.js";

const router = express.Router();


router.post("/addProduct", addProduct, requireSignIn, requireAdmin);
router.get("/getAllProducts", getAllProductDetails);
router.get("/getProduct/:productId", getSingleProductDetails);
router.put("/updateProduct/:productId", requireSignIn, requireAdmin, updateProductData);
router.delete("/deleteProduct/:productId", requireSignIn, requireAdmin, deleteProduct);
router.post("/reviewProduct", requireSignIn, addReview);
router.delete("/deleteReview/:reviewId", requireSignIn, deleteReview);

export default router;
