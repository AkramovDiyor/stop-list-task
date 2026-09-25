// server/src/services/stopList.service.ts
import { ConflictError, NotFoundError } from '../domain/errors';
import type {
  CreateStopEntryInput,
  StopListEntry,
  StopListEntryView,
} from '../domain/stopList';
import { isActive, toView } from '../domain/stopList';
import type { DishRepo, StopListRepo } from '../repositories/types';

export function createStopListService(deps: {
  stopList: StopListRepo;
  dishes: DishRepo;
  now: () => Date;
}) {
  return {
    async stopDish(input: CreateStopEntryInput): Promise<StopListEntry> {
      const dish = await deps.dishes.findById(input.dishId);
      if (!dish) {
        throw new NotFoundError(`Блюдо ${input.dishId} не найдено`);
      }

      const now = deps.now();
      const existing = await deps.stopList.findByDishId(input.dishId);
      if (existing.some((entry) => isActive(entry, now))) {
        throw new ConflictError('Блюдо уже в стоп-листе');
      }

      return deps.stopList.create({
        dishId: dish.id,
        reason: input.reason.trim(),
        stoppedAt: now.toISOString(),
        expiresAt: new Date(
          now.getTime() + input.durationMinutes * 60_000
        ).toISOString(),
        returnedAt: null,
      });
    },

    async listActive(category?: string): Promise<StopListEntryView[]> {
      const now = deps.now();
      const entries = await deps.stopList.findAll();
      const activeEntries = entries.filter((e) => isActive(e, now));

      const views: StopListEntryView[] = [];
      for (const entry of activeEntries) {
        const dish = await deps.dishes.findById(entry.dishId);
        if (!dish) continue;

        if (category && dish.category !== category) continue;

        views.push(toView(entry, dish, now));
      }

      return views;
    },

    async returnDish(id: string): Promise<StopListEntry> {
      const entry = await deps.stopList.findById(id);
      if (!entry) {
        throw new NotFoundError(`Запись ${id} не найдена`);
      }

      const now = deps.now();
      if (!isActive(entry, now)) {
        throw new ConflictError('Запись уже неактивна');
      }

      return deps.stopList.update(id, {
        returnedAt: now.toISOString(),
      });
    },

    async getHistory(
      limit: number,
      offset: number
    ): Promise<StopListEntryView[]> {
      const now = deps.now();
      const allEntries = await deps.stopList.findAll();

      const historyEntries = allEntries
        .filter((e) => !isActive(e, now))
        .sort((a, b) => new Date(b.stoppedAt).getTime() - new Date(a.stoppedAt).getTime())
        .slice(offset, offset + limit);

      const views: StopListEntryView[] = [];
      for (const entry of historyEntries) {
        const dish = await deps.dishes.findById(entry.dishId);
        if (!dish) continue;
        views.push(toView(entry, dish, now));
      }

      return views;
    },
  };
}