import { User } from "../models/index.js";
import { createUserService, getAllUsers } from "../services/user.service.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/ApiResponse.util.js";

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    sendSuccessResponse(res, users, "Users fetched successfully");
  } catch (error) {
    sendErrorResponse(res, error.message, error.statusCode || 500);
  }
};
export const createUser = async(req, res)=>{
    try {
        await createUserService(req.body);
        sendSuccessResponse(res, {}, "User created successfully");
    } catch (error) {
        sendErrorResponse(res, error.message, error.statusCode || 500);
    }
}
