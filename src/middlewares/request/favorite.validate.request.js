import { body } from 'express-validator';

export const favoriteValidateRequest = [
  body('product_id')
    .notEmpty()
    .withMessage('Product ID is required')
    .isInt({ gt: 0 })
    .withMessage('Product ID must be a positive integer'),
];
