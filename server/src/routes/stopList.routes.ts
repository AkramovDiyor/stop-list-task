import { Router } from 'express';
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
import type { CreateStopEntryInput } from '../domain/stopList';

const router = Router();

const stopListService = createStopListService({
  stopList: stopListRepo,
  dishes: dishRepo,
  now: () => new Date(),
});

// POST /api/stop-list
router.post(
  '/',
  validate(createStopEntrySchema),
  asyncHandler(async (req, res) => {
    const input = req.validated as CreateStopEntryInput;
    const entry = await stopListService.stopDish(input);
    res.status(201).json({ data: entry });
  })
);

// GET /api/stop-list
router.get(
  '/',
  validate(categoryFilterSchema),
  asyncHandler(async (req, res) => {
    const category = (req.validated?.category as string) || (req.query.category as string | undefined);
    const entries = await stopListService.listActive(category);
    res.status(200).json({ data: entries });
  })
);

// GET /api/stop-list/history
router.get(
  '/history',
  validate(paginationSchema),
  asyncHandler(async (req, res) => {
    const limit = (req.validated?.limit as number) ?? 20;
    const offset = (req.validated?.offset as number) ?? 0;
    const entries = await stopListService.getHistory(limit, offset);
    res.status(200).json({ data: entries });
  })
);

// PATCH /api/stop-list/:id/return
router.patch(
  '/:id/return',
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    const entry = await stopListService.returnDish(id);
    res.status(200).json({ data: entry });
  })
);

export const stopListRouter = router;