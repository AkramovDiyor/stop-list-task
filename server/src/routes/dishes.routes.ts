// server/src/routes/dishes.routes.ts
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { dishRepo } from '../repositories/dishRepo';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const dishes = await dishRepo.findAll();
    res.status(200).json({ data: dishes });
  })
);

export const dishesRouter = router;