import {
  createCouponService,
  destroyCouponService,
  getCouponByCodeService,
  getCouponsService,
} from '../services/coupon.service.js';
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '../utils/ApiResponse.util.js';

export const createCouponController = async (req, res) => {
  try {
    const newCoupon = await createCouponService(req.body);

    sendSuccessResponse(res, newCoupon, 'Coupon created successfully');
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode || 500);
  }
};
export const getCouponsController = async (req, res) => {
  try {
    const coupons = await getCouponsService();
    sendSuccessResponse(res, coupons, 'Coupons fetched successfully');
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode || 500);
  }
};
export const getCouponByCodeController = async (req, res) => {
  try {
    const coupon = await getCouponByCodeService(req.params.code);
    sendSuccessResponse(res, coupon, 'Coupon fetched successfully');
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode || 500);
  }
};
export const destroyCouponController = async (req, res) => {
  try {
    // To be implemented
    await destroyCouponService(req.params.couponId);
    sendSuccessResponse(res, {}, 'Coupon deleted successfully');
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode || 500);
  }
};
