import { ProductLike } from "../models/index.js"
import { ApiError } from "../utils/ApiError.util.js"


export const createLikeService=async(req)=>{
    try {
       const like = await ProductLike.create({
            user_id: req.user.id,
            product_id: req.params.id
        });

        return like;

    } catch (error) {
        throw new ApiError(error.message, error.statusCode || 500)
    }
}
