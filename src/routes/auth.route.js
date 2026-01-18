import { Router } from "express";
import {
  authLoginController,
  authRegisterController,
} from "../controllers/auth.controller.js";
import { handleValidationError } from "../middlewares/handleValidationError.middleware.js";
import {
  validateLoginUserRequest,
  validateUserRequest,
} from "../middlewares/request/validate.user.resquest.js";
const authRouter = Router();

authRouter.post(
  "/register",
  validateUserRequest,
  handleValidationError,
  authRegisterController,
);
authRouter.post(
  "/login",
  validateLoginUserRequest,
  handleValidationError,
  authLoginController,
);

export default authRouter;
