import { Brand } from "../models/index.js"
import { ApiError } from "../utils/ApiError.util.js"


export const findBrandById=async(id)=>{
    try {
        const brand = await Brand.findByPk(id);
        if(!brand){
            throw new ApiError('Brand Not Found', 404)
        }
        return;
    } catch (error) {
        throw new ApiError(error.message, error.statusCode)
    }
}
