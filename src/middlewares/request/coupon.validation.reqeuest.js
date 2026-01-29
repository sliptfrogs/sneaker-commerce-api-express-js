import { body } from "express-validator";
import { ApiError } from "../../utils/ApiError.util.js";

export const createCouponValidation = [
    body('code').notEmpty().withMessage('Coupon code is required'),
    body('discount_type').isIn(['FIXED', 'PERCENT']).withMessage('Discount type must be either PERCENT or FIXED'),
    body('discount_value').isFloat({ gt: 0 }).withMessage('Discount value must be a number greater than 0'),
    body('max_discount').optional().isFloat({ gt: 0 }).withMessage('Max discount must be a number greater than 0'),
    body('start_date').custom((value)=>{
        const currentDate = new Date();
        if(new Date(value) < currentDate){
            throw new ApiError("Start date must be current date or future date", 400)
        }
        return true;
    }),
    body('end_date').custom((value, {req})=>{
        const currentDate = new Date();
        if(new Date(value) <= new Date(req.body.start_date)){
            throw new ApiError("End date must be after start date", 400)
        }
        if(new Date(value)< currentDate){
            throw new ApiError("End date must be a future date", 400)
        }
        return true;
    }),
    body('usage_limit').optional().isInt({ gt: 0 }).withMessage('Usage limit must be an integer greater than 0'),
    body('is_active').isBoolean().withMessage('Is active must be a boolean value')
]
