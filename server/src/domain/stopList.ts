// server/src/domain/stopList.ts
export type DishCategory = 'Кухня' | 'Бар' | 'Десерты';

export interface Dish {
  id: string;
  name: string;
  category: DishCategory;
  price: number;
}

export interface StopListEntry {
  id: string;
  dishId: string;
  reason: string;
  stoppedAt: string; // ISO 8601
  expiresAt: string; // ISO 8601
  returnedAt: string | null;
}

export interface StopListEntryView extends StopListEntry {
  dish: Dish;
  status: 'active' | 'returned' | 'expired';
  minutesLeft: number;
}

export interface CreateStopEntryInput {
  dishId: string;
  reason: string;
  durationMinutes: number;
}

// --- Чистые функции (Business Rules) ---

export function isActive(entry: StopListEntry, now: Date): boolean {
  if (entry.returnedAt !== null) return false;
  return new Date(entry.expiresAt).getTime() > now.getTime();
}

export function getStatus(
  entry: StopListEntry, 
  now: Date
): StopListEntryView['status'] {
  if (entry.returnedAt !== null) return 'returned';
  return isActive(entry, now) ? 'active' : 'expired';
}

export function getMinutesLeft(entry: StopListEntry, now: Date): number {
  if (entry.returnedAt !== null) return 0;
  const diffMs = new Date(entry.expiresAt).getTime() - now.getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
}

export function toView(
  entry: StopListEntry, 
  dish: Dish, 
  now: Date
): StopListEntryView {
  return {
    ...entry,
    dish,
    status: getStatus(entry, now),
    minutesLeft: getMinutesLeft(entry, now),
  };
}