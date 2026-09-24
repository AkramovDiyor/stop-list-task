import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { StopListService } from './services/stopList.service';
import { validate } from './middleware/validate';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();
const service = new StopListService(prisma);

const createStopSchema = z.object({
  dishId: z.string().uuid('Некорректный ID блюда'),
  reason: z.string().trim().min(5, 'Минимум 5 символов').max(200, 'Максимум 200 символов'),
  durationMinutes: z.number().int('Должно быть целым числом').min(15, 'Минимум 15 минут').max(720, 'Максимум 720 минут')
});

app.get('/api/dishes', async (req, res, next) => {
  try { res.json(await prisma.dish.findMany()); } 
  catch (e) { next(e); }
});

app.post('/api/stop-list', validate(createStopSchema), async (req, res, next) => {
  try {
    const result = await service.stopDish(req.body);
    res.status(201).json(result);
  } catch (e) { next(e); }
});

app.get('/api/stop-list', async (req, res, next) => {
  try {
    const result = await service.getActive(req.query.category as string);
    res.json(result);
  } catch (e) { next(e); }
});

app.patch('/api/stop-list/:id/return', async (req, res, next) => {
  try {
    const result = await service.returnDish(req.params.id);
    res.json(result);
  } catch (e) { next(e); }
});

app.get('/api/stop-list/history', async (req, res, next) => {
  try {
    const limit = z.coerce.number().int().min(1).max(100).default(20).parse(req.query.limit);
    const offset = z.coerce.number().int().min(0).default(0).parse(req.query.offset);
    const result = await service.getHistory(limit, offset);
    res.json(result);
  } catch (e) { next(e); }
});

app.use(errorHandler);
export default app;