import { body } from "express-validator";

export const BrandRequestValidation = [
    body('brand_name').notEmpty().withMessage('Brand name is required')
]
