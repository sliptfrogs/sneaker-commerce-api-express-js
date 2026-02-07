import { Router } from 'express';
import {
  createCheckoutController,
  payUserOrderController,
  getAllCheckoutsController,
} from '../controllers/order.controller.js';
import { checkoutValidation } from '../middlewares/request/checkout.validation.request.js';
import { handleValidationError } from '../middlewares/handleValidationError.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import { PayValidationRequest } from '../middlewares/request/pay.validation.request.js';

const orderRoute = Router();

orderRoute.post(
  '/checkout',
  protect,
  checkoutValidation,
  handleValidationError,
  createCheckoutController,
);
orderRoute.get('/checkouts', protect, getAllCheckoutsController);

orderRoute.put(
  '/pay',
  protect,
  PayValidationRequest,
  handleValidationError,
  payUserOrderController,
);
export default orderRoute;
