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
  "",
  cateogryValidateRequest,
  handleValidationError,
  createCategoryController,
);
categoryRouter.get("", getCategoriesController);
categoryRouter.get("/:id", getCategoryController);
categoryRouter.delete("/:id", destroyCategoryController);
categoryRouter.patch(
  "/:id",
  cateogryValidateRequest,
  handleValidationError,
  updateCategoryController,
);
export default categoryRouter;
