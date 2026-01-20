import { createLikeService } from "../services/like.service.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/ApiResponse.util.js";

export const createLikeController = async (req, res) => {
  try {
    const like = await createLikeService(req);
    sendSuccessResponse(res, like, "CREATED");
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode || 500);
  }
};
export const getLikesController = async (req, res) => {};

export const updateLikeController = async (req, res) => {};
export const destroyLikeController = async (req, res) => [];
