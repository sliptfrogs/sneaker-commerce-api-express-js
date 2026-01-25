import { where } from "sequelize";
import { Category } from "../models/index.js";
import { ApiError } from "../utils/ApiError.util.js";

export const createCategoryService = async (reqBody) => {
  console.log("name", reqBody);

  try {
    const [category, created] = await Category.findOrCreate({
      where: {
        name: reqBody,
      },
      defaults: {
        name: reqBody,
      },
    });
    if (!created) {
      throw new ApiError("Category Already Exist", 409);
    }

    return category;
  } catch (error) {
    throw new ApiError(error.message, error.statusCode || 500);
  }
};

export const getCategoriesService = async () => {
  try {
    const categories = await Category.findAll();

    return categories;
  } catch (error) {
    throw new ApiError(error.message, error.statusCode);
  }
};
export const getCategoryService = async (id) => {
  try {
    const category = await Category.findOne({
      where: {
        id,
      },
    });

    if (!category) {
      throw new ApiError("Category not found", 404);
    }
    return category;
  } catch (error) {
    throw new ApiError(error.message, error.statusCode);
  }
};
export const destroyCategoryService = async (id) => {
  try {
    const category = await Category.findByPk(id);

    if (!category) {
      throw new ApiError("Category Not Found", 404);
    }
    await category.destroy();
    return;
  } catch (error) {
    throw new ApiError(error.message, error.statusCode);
  }
};
export const updateCategoryService = async (id,updateData) => {
  try {
    const category = await Category.findByPk(id);

    if (!category) {
      throw new ApiError("Category Not Found", 404);
    }
    await category.update(updateData)
    return category;
  } catch (error) {
    throw new ApiError(error.message, error.statusCode)
  }
};
