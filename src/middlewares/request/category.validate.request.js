import { body } from "express-validator";

export const cateogryValidateRequest = [
    body('category_name').notEmpty().withMessage('Category Name is missing')
]
