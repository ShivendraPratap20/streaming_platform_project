import { Request, Response, NextFunction } from "express";

function errorHandler(err, req: Request, res: Response, next: NextFunction): void {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || 500;

    console.error(err);

    res.status(statusCode).json({
        status: false,
        message: err.isOperational
            ? err.message
            : "Internal Server Error",
    });
}

export default errorHandler;