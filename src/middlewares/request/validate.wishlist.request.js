import { body } from 'express-validator';

export const wishlistValidation = [
  body('product_id')
    .notEmpty()
    .withMessage('Product ID is requred')
    .isInt()
    .withMessage('Product ID must be an Integer'),
];
