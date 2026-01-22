import { body } from "express-validator";


export const checkoutValidation=[
    body('items').isArray({min: 1, max: 10}).withMessage('Items must be array and length between 1 to 10'),
    body('payment_method').isString().withMessage('Payment method must be string').isIn(['CASH', 'CREDIT_CARD', 'OTHERS']).withMessage('Payment Method be in (CASH, CREDIT_CARD,OTHERS)')
]
