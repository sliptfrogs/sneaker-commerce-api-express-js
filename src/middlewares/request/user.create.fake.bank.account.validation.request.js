import { body } from "express-validator";

export const CreateFakeBankRequestValidation = [
    body('user_id').notEmpty().withMessage('User ID is required'),
    body('card_number').notEmpty().withMessage('Card number is required'),
    body('balance').isFloat({ min: 0 }).withMessage('Balance must be a positive number'),
]
