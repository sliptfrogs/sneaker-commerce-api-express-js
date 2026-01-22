import { body } from "express-validator";


export const PayValidationRequest=[
    body('orderId').notEmpty().withMessage('Order ID is required')
]
