import { Router } from 'express';
import {
  createProductController,
  destroyProductController,
  getPopularProductsController,
  getProductController,
  getProductsController,
  getProductsViaCategoryController,
  updateProductController,
} from '../controllers/product.controller.js';
import {
  productUpdateValidation,
  productValidation,
} from '../middlewares/request/product.validate.request.js';
import { handleValidationError } from '../middlewares/handleValidationError.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import { uploadProductImages } from '../middlewares/upload.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const productRoute = Router();

productRoute.post(
  '/',
  protect,
  authorizeRoles('ADMIN'),
  ...uploadProductImages,
  productValidation,
  handleValidationError,
  createProductController,
);

productRoute.get('/', protect, getProductsController);
/**
 * Get Popular Products - Must be before /:id wildcard route
 */
productRoute.get('/popular', getPopularProductsController);
// productRoute.get('/category/:id',getProductsViaCategoryController)
productRoute.delete(
  '/:id',
  protect,
  authorizeRoles('ADMIN'),
  destroyProductController,
);
productRoute.get('/:id', getProductController);
productRoute.patch(
  '/:id',
  protect,
  authorizeRoles('ADMIN'),
  ...uploadProductImages,
  productUpdateValidation,
  handleValidationError,
  updateProductController,
);

export default productRoute;
