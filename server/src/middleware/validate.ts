import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../domain/errors';

declare module 'express' {
  interface Request {
    validated?: Record<string, unknown>;
  }
}

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawData: Record<string, unknown> = {
        ...(req.body as Record<string, unknown> || {}),
        ...(req.params as Record<string, unknown> || {}),
        ...(req.query as Record<string, unknown> || {}),
      };

      const validatedData = schema.parse(rawData);
      req.validated = validatedData as Record<string, unknown>;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as any;
        const message = zodError.issues
          .map((issue: any) => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ');
        next(new ValidationError(message));
      } else if (error instanceof Error) {
        next(new ValidationError(error.message));
      } else {
        next(new ValidationError('Невалидные данные'));
      }
    }
  };
}