import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  addToFavorite,
  removeFavorite,
  getMyFavorites,
} from '../controllers/favorite.controller.js';

import { favoriteValidateRequest } from '../middlewares/request/favorite.validate.request.js';

const favoriteRouter = express.Router();

// POST /favorites
favoriteRouter.post('/', protect, favoriteValidateRequest, addToFavorite);

// DELETE /favorites/:id (Product_ID)
favoriteRouter.delete('/:id', protect, removeFavorite);

// GET /favorites
favoriteRouter.get('/me', protect, favoriteValidateRequest, getMyFavorites);

export default favoriteRouter;
