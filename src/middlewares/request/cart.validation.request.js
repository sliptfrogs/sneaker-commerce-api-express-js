import { body } from 'express-validator';

export const CartValidationRequest = [
  body('product_id').notEmpty().withMessage('Product ID is required'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be String and at least 1'),
];
