import { Router } from 'express';
import {
  getAllReviews,
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
} from '../controllers/review.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
const productReviewRouter = Router();
// Get All
productReviewRouter.get('/', getAllReviews);
// Get One
productReviewRouter.get('/:id', getReviewById);
// CREATE
productReviewRouter.post('/', protect, createReview);
// UPDATE
productReviewRouter.put('/:id', protect, updateReview);
// Delete
productReviewRouter.delete('/:id', protect, deleteReview);

export default productReviewRouter;
