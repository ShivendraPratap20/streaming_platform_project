import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError.js";

const isDev = true;

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof AppError && err.isOperational) {
        return res.status(err.statusCode).json({
            status: false,
            message: err.message,
            errorDetails: err.errorDetails,
            ...(isDev && { stack: err.stack }),
        });
    }

    console.error("UNEXPECTED ERROR:", {
        method: req.method,
        url: req.originalUrl,
        error: err,
    });

    return res.status(500).json({
        success: false,
        message: isDev ? err.message : "Something went wrong",
        ...(isDev && { stack: err.stack }),
    });
}

const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
};

export default errorHandler;
export {
    notFound,
};