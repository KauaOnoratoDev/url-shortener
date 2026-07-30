import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/errors/AppError';
import { ZodError } from 'zod';

export function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    void next;

    if (!(error instanceof AppError)) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: 'Dados inválidos',
                issues: error.issues,
            });
        }

        console.error(error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }

    return res.status(error.statusCode).json({
        message: error.message,
    });
}
