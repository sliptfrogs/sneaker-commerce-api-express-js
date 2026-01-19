import { body } from "express-validator";

export const likeMiddlewareValidate = [
    body('product_id').notEmpty().withMessage('Product id is missing')
]
