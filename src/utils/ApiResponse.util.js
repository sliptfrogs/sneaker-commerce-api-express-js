
export const sendSuccessResponse = (res, data=[], message='', meta = [])=>{
    return res.status(200).json({success: true, message,data,meta})
}

export const sendErrorResponse = (res, message= "Something went wrong", statusCode = 500, errors=[])=>{
    return res.status(statusCode).json({success: false, message, errors})
}
