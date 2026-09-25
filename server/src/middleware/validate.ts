import type { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../domain/errors';

declare module 'express' {
  interface Request {
    validated?: Record<string, unknown>;
  }
}

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawData = {
        ...(req.body || {}),
        ...(req.params || {}),
        ...(req.query || {}),
      };
      
      // Парсим и получаем чистые, типизированные данные
      const validatedData = schema.parse(rawData);
      
      // Сохраняем в безопасное поле
      req.validated = validatedData;
      
      // Для методов изменения данных обновляем body для удобства роутов
      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        req.body = { ...req.body, ...validatedData };
      }
      
      next();
    } catch (error) {
      if (error instanceof Error) {
        next(new ValidationError(error.message));
      } else {
        next(new ValidationError('Невалидные данные'));
      }
    }
  };
}