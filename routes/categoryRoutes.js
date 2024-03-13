import express from "express";
import {
  addCategory,
  deleteCategory,
  updateCategory,
  getCategoryData,
  getAllcategories
} from "../controllers/categoriesController.js";
import { requireAdmin, requireSignIn } from "../middlewares/authenticationMiddleware.js";
const router = express.Router();

router.route('/allCategories').get(requireSignIn, requireAdmin, getAllcategories);
router.route('/add').post(requireSignIn, requireAdmin, addCategory);
router.route('/delete/:categoryId').delete(requireSignIn, requireAdmin, deleteCategory);
router.route('/update/:categoryId').put(requireSignIn, requireAdmin, updateCategory);
router.route('/:categoryId').get(requireSignIn, requireAdmin, getCategoryData);

export default router;