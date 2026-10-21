class AppError extends Error{
    public readonly statusCode:number;
    public readonly isOperational: boolean;
    public readonly errorDetails?: any;

    public constructor(message: string, statusCode: number = 500, isOperational: boolean = true, errorDetails?: any) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errorDetails = errorDetails;
        Error.captureStackTrace(this, this.constructor);
    }
}


export { AppError };