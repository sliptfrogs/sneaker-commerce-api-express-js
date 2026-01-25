import {
  createProductService,
  destroyProductService,
  getAllProductsViaCategoryService,
  getPopularProductsService,
  getProductByIdService,
  getProductsService,
  updateProductService,
} from "../services/product.service.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/ApiResponse.util.js";

export const createProductController = async (req, res) => {
  try {
    await createProductService(req);
    sendSuccessResponse(res, [], "Created");
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode, error);
  }
};
export const getProductsController = async (req, res) => {
  try {
    const products = await getProductsService();
    sendSuccessResponse(res, products, "Success");
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode, error);
  }
};

export const getProductsViaCategoryController = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const products = await getAllProductsViaCategoryService(categoryId);
    sendSuccessResponse(
      res,
      products,
      `Product with category ${categoryId} fetched`,
    );
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode);
  }
};

export const getProductController = async (req, res) => {
  try {
    const product = await getProductByIdService(req.params.id);

    sendSuccessResponse(res, product, "Success");
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode);
  }
};
export const updateProductController = async (req, res) => {
  try {
    await updateProductService(req.params.id, req);
    sendSuccessResponse(res, [], "Updated");
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode);
  }
};
export const destroyProductController = async (req, res) => {
    try {
        await destroyProductService(req.params.id)
        sendSuccessResponse(res, [], 'Product Deleted')
    } catch (error) {
        sendErrorResponse(res, error.message, error.statusCode)
    }
};
/**
 * Get Popular Products
 */
export const getPopularProductsController=async(req,res)=>{
    try {
      const popularProducts=await getPopularProductsService();
      sendSuccessResponse(res, popularProducts, "Success");
    } catch (error) {
        sendErrorResponse(res, error.message, error.statusCode)
    }
}
