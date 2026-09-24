import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../domain/errors';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: { code: err.code, message: err.message } });
  }
  
  if (err instanceof ZodError) {
    return res.status(422).json({
      error: { 
        code: 'VALIDATION_ERROR', 
        message: 'Некорректные данные', 
        details: err.errors.map((e: any) => ({ path: e.path.join('.'), message: e.message }))
      }
    });
  }

  console.error('UNHANDLED ERROR:', err);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Внутренняя ошибка сервера' } });
};