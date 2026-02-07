import { Router } from 'express';
import {
  createRecentlyViewedController,
  getRecentlyViewedController,
} from '../controllers/recently.view.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { RecentlyViewedValidationRequest } from '../middlewares/request/recently.viewed.validation.request.js';
import { handleValidationError } from '../middlewares/handleValidationError.middleware.js';
const recentlyViewRoute = Router();

recentlyViewRoute.post(
  '/',
  protect,
  RecentlyViewedValidationRequest,
  handleValidationError,
  createRecentlyViewedController,
);
recentlyViewRoute.get('/', protect, getRecentlyViewedController);
export default recentlyViewRoute;
