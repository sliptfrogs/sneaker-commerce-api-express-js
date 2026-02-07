import { body } from 'express-validator';

export const validateUserRequest = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password_hash')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('phone_number')
    .optional()
    .isMobilePhone()
    .withMessage('Invalid phone number'),
  body('avatar_url').optional().isURL().withMessage('Invalid avatar URL'),
];
export const validateLoginUserRequest = [
  body('email')
    .notEmpty()
    .withMessage('Email field is missing')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password_hash').notEmpty().withMessage('Password field is missing'),
];
