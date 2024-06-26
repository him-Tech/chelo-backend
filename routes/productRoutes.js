import express from "express";
import {
  addProduct,
  getAllProductDetails,
  getSingleProductDetails,
  updateProductData,
  deleteProduct,
} from "../controllers/productController.js";
import { requireSignIn, requireAdmin } from "../middlewares/authenticationMiddleware.js";

const router = express.Router();


router.post("/addProduct", addProduct);
router.get("/getAllProducts", getAllProductDetails);
router.get("/getProduct/:productId", getSingleProductDetails);
router.put("/updateProduct/:productId", requireSignIn, requireAdmin, updateProductData);
router.delete("/deleteProduct/:productId", requireSignIn, requireAdmin, deleteProduct);

export default router;
