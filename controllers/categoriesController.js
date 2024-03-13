import Category from "../models/categorySchema.js";

export const addCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "This category already exists",
      });
    }

    const addNewCategory = new Category({
      name,
      description,
      isActive,
    });

    await addNewCategory.save();

    res.status(201).json({
      success: true,
      message: "Category added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while adding category",
    });
  }
};

export const getCategoryData = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).json({
      success: true,
      data: category,
      message: "Category data fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching category data",
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while updating category data",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await Category.findByIdAndDelete(categoryId);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while deleting category",
    });
  }
};

export const getAllcategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      message: "All categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching all categories",
    });
  }
};
