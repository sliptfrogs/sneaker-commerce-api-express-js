import { Router } from 'express';
import {
  createLikeController,
  destroyLikeController,
  getLikesController,
  updateLikeController,
} from '../controllers/like.controller.js';
import { likeMiddlewareValidate } from '../middlewares/request/validate.like.request.js';
import { handleValidationError } from '../middlewares/handleValidationError.middleware.js';
const likeRoute = Router();

likeRoute.post(
  '/',
  likeMiddlewareValidate,
  handleValidationError,
  createLikeController,
);
likeRoute.get('/', getLikesController);
likeRoute.patch('/:id', updateLikeController);
likeRoute.delete('/:id', destroyLikeController);

export default likeRoute;
