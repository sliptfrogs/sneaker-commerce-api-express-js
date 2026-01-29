import { Coupon } from "../models/index.js";
import { ApiError } from "../utils/ApiError.util.js";

export const createCouponService = async (coupon_request) => {
  try {
    const {
      code,
      discount_type,
      discount_value,
      max_discount,
      start_date,
      end_date,
      usage_limit,
      is_active,
    } = coupon_request;

    const [newCoupon, create] = await Coupon.findOrCreate({
      where: { code },
      defaults: {
        code,
        discount_type,
        discount_value,
        max_discount,
        start_date,
        end_date,
        usage_limit,
        is_active,
      },
      returning: true,
    });

    if (!create) {
      throw new ApiError("Coupon code already exists", 409);
    }

    return newCoupon;
  } catch (error) {
    throw new ApiError(
      "Failed to create coupon: " + error.message,
      error.statusCode || 500,
    );
  }
};
export const getCouponsService = async () => {
  try {
    const coupons = await Coupon.findAll();
    return coupons;
  } catch (error) {
    throw new Error("Failed to fetch coupons: " + error.message);
  }
};
export const getCouponByCodeService = async (code) => {
  try {
    const coupon = await Coupon.findOne({ where: { code } });
    if (!coupon) {
      throw new ApiError("Coupon not found", 404);
    }
    if (!coupon.is_active) {
      throw new ApiError("Coupon is not active", 400);
    }
    if (
      coupon.usage_limit !== null &&
      coupon.times_used >= coupon.usage_limit
    ) {
      throw new ApiError("Coupon usage limit exceeded", 400);
    }
    const currentDate = new Date();
    if (currentDate > coupon.end_date) {
      throw new ApiError("Coupon has expired", 400);
    }
    return coupon;
  } catch (error) {
    throw new ApiError(
      "Failed to fetch coupon by code: " + error.message,
      error.statusCode || 500,
    );
  }
};
export const destroyCouponService = async (couponId) => {
  try {
    const deletedCount = await Coupon.destroy({ where: { id: couponId } });
    if (deletedCount === 0) {
      throw new ApiError("Coupon not found", 404);
    }
    return;
  } catch (error) {
    throw new ApiError(
      "Failed to delete coupon: " + error.message,
      error.statusCode || 500,
    );
  }
};
