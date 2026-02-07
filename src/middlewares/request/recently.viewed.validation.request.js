import { body } from 'express-validator';

export const RecentlyViewedValidationRequest = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isInt()
    .withMessage('Product ID must be an integer'),
];
