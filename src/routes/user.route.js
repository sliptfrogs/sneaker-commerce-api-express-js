import { Router } from "express";
import { createUser, getUsers } from "../controllers/user.controller.js";
import { validateUserRequest } from "../middlewares/request/validate.user.resquest.js";
import { handleValidationError } from "../middlewares/handleValidationError.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const userRouter = Router();

// Get All Users
userRouter.get('/',protect, authorizeRoles('ADMIN'),getUsers)
// CREATE
userRouter.post('/',validateUserRequest,handleValidationError, createUser)

export default userRouter;
