const asyncHandler = (requestHandler) => (req, res, next) => {
    return Promise.resolve(requestHandler(req, res, next)).catch(err => next(err));
}

// const asyncHandler = (fn) => async(req,res,next)=>{
//     try {
//         fn(req,res,next)
//     }
//     catch(err) {
//         res.status(err.code || 500).json({
//            sucess: false,
//            message: err.message
//         })
//     }
// }

export { asyncHandler };