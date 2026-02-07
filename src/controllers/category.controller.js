import {
  createCategoryService,
  destroyCategoryService,
  getCategoriesService,
  getCategoryService,
  updateCategoryService,
} from '../services/category.service.js';
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '../utils/ApiResponse.util.js';

export const createCategoryController = async (req, res) => {
  try {
    const category = await createCategoryService(req.body.category_name);
    sendSuccessResponse(res, category, 'Created');
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode, error);
  }
};
export const getCategoriesController = async (req, res) => {
  try {
    const categories = await getCategoriesService();
    sendSuccessResponse(res, categories, 'OK');
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode, error);
  }
};
export const getCategoryController = async (req, res) => {
  try {
    const category = await getCategoryService(req.params.id);
    sendSuccessResponse(res, category, 'OK');
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode, error);
  }
};
export const destroyCategoryController = async (req, res) => {
  try {
    await destroyCategoryService(req.params.id);
    sendSuccessResponse(res, [], 'DELETED');
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode, error);
  }
};
export const updateCategoryController = async (req, res) => {
  try {
    const categoryUpdate = await updateCategoryService(req.params.id, {
      name: req.body.category_name,
    });
    sendSuccessResponse(res, categoryUpdate, 'UPDATED');
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode, error);
  }
};
