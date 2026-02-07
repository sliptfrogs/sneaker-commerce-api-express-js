import { Router } from 'express';
import {
  createCouponController,
  destroyCouponController,
  getCouponByCodeController,
  getCouponsController,
} from '../controllers/coupon.controller.js';
import { createCouponValidation } from '../middlewares/request/coupon.validation.reqeuest.js';
import { handleValidationError } from '../middlewares/handleValidationError.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const couponRouter = Router();

couponRouter.post(
  '/create',
  protect,
  authorizeRoles('ADMIN'),
  createCouponValidation,
  handleValidationError,
  createCouponController,
);
couponRouter.get('/', protect, authorizeRoles('ADMIN'), getCouponsController);
couponRouter.get('/:code', protect, getCouponByCodeController);
couponRouter.delete(
  '/:couponId',
  protect,
  authorizeRoles('ADMIN'),
  destroyCouponController,
);
export default couponRouter;
