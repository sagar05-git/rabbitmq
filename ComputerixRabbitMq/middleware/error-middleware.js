// error handling middleware
export const errorHandlerMiddleware = (
    err,
    req,
    res,
    next
) => {
    console.error("Error:", err);

    const statusCode = err.statusCode || 500;

    const message =
        err.message || "Internal Server Error";

    res.status(statusCode).json({
        isSuccess: false,
        error: {
            message,
            statusCode,
        },
    });
};