import { Router } from 'express';
import {
  authLoginController,
  authRegisterController,
  refreshTokenController,
} from '../controllers/auth.controller.js';
import { handleValidationError } from '../middlewares/handleValidationError.middleware.js';
import {
  validateLoginUserRequest,
  validateUserRequest,
} from '../middlewares/request/validate.user.resquest.js';
import { RefreshTokenValidationRequest } from '../middlewares/request/refresh.token.validation.request.js';
import { protectRefreshToken } from '../middlewares/auth.middleware.js';
const authRouter = Router();

authRouter.post(
  '/register',
  validateUserRequest,
  handleValidationError,
  authRegisterController,
);
authRouter.post(
  '/login',
  validateLoginUserRequest,
  handleValidationError,
  authLoginController,
);
authRouter.post('/refresh-token', protectRefreshToken, refreshTokenController);

export default authRouter;
