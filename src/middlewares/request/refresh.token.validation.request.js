import { body } from "express-validator";

export const RefreshTokenValidationRequest = [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  // Validate that the refresh token is provided and is a valid JWT
];
