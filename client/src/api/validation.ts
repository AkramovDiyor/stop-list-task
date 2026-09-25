import { z } from 'zod';

export const createStopEntrySchema = z.object({
  dishId: z.string().min(1, 'Выберите блюдо из списка'),
  reason: z
    .string()
    .min(5, 'Минимум 5 символов')
    .max(200, 'Максимум 200 символов')
    .refine((val) => val.trim().length > 0, 'Причина не может состоять только из пробелов'),
  durationMinutes: z.coerce
    .number()
    .int('Должно быть целым числом')
    .min(15, 'Минимум 15 минут')
    .max(720, 'Максимум 720 минут'),
});

export type CreateStopEntryInput = z.infer<typeof createStopEntrySchema>;