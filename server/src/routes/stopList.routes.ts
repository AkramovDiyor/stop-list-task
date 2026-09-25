import { Router, Request } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { createStopListService } from '../services/stopList.service';
import { stopListRepo } from '../repositories/stopListRepo';
import { dishRepo } from '../repositories/dishRepo';
import {
  createStopEntrySchema,
  paginationSchema,
  categoryFilterSchema,
} from '../middleware/validation';
import { validate } from '../middleware/validate';

const router = Router();

const stopListService = createStopListService({
  stopList: stopListRepo,
  dishes: dishRepo,
  now: () => new Date(),
});

router.post(
  '/',
  validate(createStopEntrySchema),
  asyncHandler(async (req, res) => {
    const entry = await stopListService.stopDish(req.body);
    res.status(201).json({ data: entry });
  })
);

router.get(
  '/',
  validate(categoryFilterSchema),
  asyncHandler(async (req, res) => {
    const category = (req.validated?.category as string) || (req.query.category as string | undefined);
    const entries = await stopListService.listActive(category);
    res.status(200).json({ data: entries });
  })
);

router.get(
  '/history',
  validate(paginationSchema),
  asyncHandler(async (req, res) => {
    // Берем уже преобразованные в числа значения из validated
    const limit = (req.validated?.limit as number) ?? 20;
    const offset = (req.validated?.offset as number) ?? 0;
    
    const entries = await stopListService.getHistory(limit, offset);
    res.status(200).json({ data: entries });
  })
);

router.patch(
  '/:id/return',
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    const entry = await stopListService.returnDish(id);
    res.status(200).json({ data: entry });
  })
);

export const stopListRouter = router;