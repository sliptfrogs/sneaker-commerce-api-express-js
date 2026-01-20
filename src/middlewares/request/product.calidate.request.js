import { body } from "express-validator";


export const productValidation = [
    body('title').notEmpty().withMessage('Title is required').isString().withMessage('Title must be string'),
    body('description').notEmpty().withMessage('Description is required').isString().withMessage('Description must be string'),
    body('category_id').notEmpty().withMessage('Category id is missing').isInt().withMessage('Category ID must be number'),
    body('brand_id').notEmpty().withMessage('Brand id is missing').isInt().withMessage('Brand ID must be number'),
    body('price').notEmpty().withMessage('Price is missing').isFloat().withMessage('Price must be float/decimal'),
    body('discount_percentage').optional().isFloat().withMessage('Discount Percentage must be float/decimal'),
    body('rating').optional().isInt().withMessage('Rating must be number(integer)'),
    body('stock').optional().isInt().withMessage('Stock must be number(integer)'),
    body('sku').optional().isString().withMessage('SKU must be String'),
    body('weight').optional().isFloat().withMessage('Weight must be decimal'),
    body('height').optional().isInt().withMessage('Height must be number(integer)'),
    body('warranty_information').optional().isString().withMessage('Warranty Information must be String'),
    body('shipping_information').optional().isString().withMessage('Shipping Information must be String'),
    body('availability').optional().isIn(["IN_STOCK", "OUT_OF_STOCK", "PREORDER"]).withMessage('Invalid Availability'),
    body('return_policy').optional().isString().withMessage('Return Policy must be String'),
    body('qr_code_url').optional().isString().withMessage('Qr Code Url must be String'),
    body('thumbnail').notEmpty().withMessage('Thumbnail is required').isString().withMessage('Thumbnail must be String'),
]
