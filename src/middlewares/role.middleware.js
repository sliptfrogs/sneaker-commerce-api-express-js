import { sendErrorResponse } from "../utils/ApiResponse.util.js";

export const authorizeRoles = (...allowedRoles)=>{
    return (req,res,next)=>{
        const user = req.user;

        console.log('user-authorize', user);
        

        if(!user){
            sendErrorResponse(res, 'Unauthorized', 401)
        }
        if(!allowedRoles.includes(user.role)){
            sendErrorResponse(res, 'Forbidden: insufficient role');
        }

        next();
    }
}
