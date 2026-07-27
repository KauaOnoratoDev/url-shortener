import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/errors/AppError';

export function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!(error instanceof AppError)) {
        return next(error);
    }

    return res.status(error.statusCode).json({
        message: error.message,
    });
}
