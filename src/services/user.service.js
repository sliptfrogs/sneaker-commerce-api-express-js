import { User } from "../models/index.js";
import { ApiError } from "../utils/ApiError.util.js";

export const getAllUsers = async()=>{
    const users = await User.findAll();

    if(users.length === 0){
        throw new ApiError("No users found", 404);
    }
    return users;
}
export const createUserService = async(userData)=>{
    const user = await User.create(userData);
    if(!user){
        throw new ApiError("User creation failed", 500);
    }
    return user;
}
