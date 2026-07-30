import { Request, Response } from 'express';
import { ZodError, z } from 'zod';
import { AppError } from '@shared/errors/AppError';
import { errorHandler } from '@shared/middlewares/errorHandler';

describe('errorHandler', () => {
    let response: Response;

    beforeEach(() => {
        response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;
        jest.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    afterEach(() => jest.restoreAllMocks());

    it('returns the status and message from an AppError', () => {
        errorHandler(
            new AppError('Business error', 422),
            {} as Request,
            response,
            jest.fn()
        );

        expect(response.status).toHaveBeenCalledWith(422);
        expect(response.json).toHaveBeenCalledWith({
            message: 'Business error',
        });
    });

    it('returns validation details for a ZodError', () => {
        let error: ZodError;
        try {
            z.object({ name: z.string() }).parse({ name: 1 });
        } catch (caught) {
            error = caught as ZodError;
        }

        errorHandler(error!, {} as Request, response, jest.fn());

        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith({
            message: 'Dados inválidos',
            issues: error!.issues,
        });
    });

    it('returns 500 for unexpected errors', () => {
        errorHandler(
            new Error('Unexpected error'),
            {} as Request,
            response,
            jest.fn()
        );

        expect(response.status).toHaveBeenCalledWith(500);
        expect(response.json).toHaveBeenCalledWith({
            message: 'Erro interno do servidor',
        });
    });
});
