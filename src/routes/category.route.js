import { Router } from "express";
import {
  createCategoryController,
  destroyCategoryController,
  getCategoriesController,
  getCategoryController,
  updateCategoryController,
} from "../controllers/category.controller.js";
import { cateogryValidateRequest } from "../middlewares/request/category.validate.request.js";
import { handleValidationError } from "../middlewares/handleValidationError.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const categoryRouter = Router();

categoryRouter.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  cateogryValidateRequest,
  handleValidationError,
  createCategoryController,
);
categoryRouter.get(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  getCategoriesController,
);
categoryRouter.get(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  getCategoryController,
);
categoryRouter.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  destroyCategoryController,
);
categoryRouter.patch(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  cateogryValidateRequest,
  handleValidationError,
  updateCategoryController,
);
export default categoryRouter;
