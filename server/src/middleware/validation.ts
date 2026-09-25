import { z } from 'zod';

export const createStopEntrySchema = z.object({
  dishId: z.string().min(1, 'dishId обязателен'),
  reason: z
    .string()
    .trim()
    .min(5, 'Причина должна быть минимум 5 символов')
    .max(200, 'Причина должна быть максимум 200 символов')
    .refine((val) => val.trim().length > 0, 'Причина не может быть пустой'),
  durationMinutes: z
    .number()
    .int('durationMinutes должен быть целым числом')
    .min(15, 'Минимум 15 минут')
    .max(720, 'Максимум 720 минут'),
});

export const returnStopEntrySchema = z.object({
  id: z.string().min(1, 'id обязателен'),
});

export const paginationSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .refine((val) => !isNaN(val) && val >= 1 && val <= 100, {
      message: 'limit должен быть от 1 до 100',
    }),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: 'offset должен быть >= 0',
    }),
});

export const categoryFilterSchema = z.object({
  category: z
    .enum(['Кухня', 'Бар', 'Десерты'])
    .optional(),
});