import {Router} from 'express'
import { createProductController, destroyProductController, getProductController, getProductsController, getProductsViaCategoryController, updateProductController } from '../controllers/product.controller.js';
import { productValidation } from '../middlewares/request/product.calidate.request.js';
import { handleValidationError } from '../middlewares/handleValidationError.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';

const productRoute = Router();

productRoute.post('/',protect, productValidation,handleValidationError,createProductController)
productRoute.get('/', getProductsController)
// productRoute.get('/category/:id',getProductsViaCategoryController)
productRoute.get('/:id', getProductController)
productRoute.patch('/:id', updateProductController)
productRoute.delete('/:id', destroyProductController)

export default productRoute;
