import type { Dish, StopListEntry } from '../domain/stopList';

export interface DishRepo {
  findById(id: string): Promise<Dish | null>;
  findAll(): Promise<Dish[]>;
}

export interface StopListRepo {
  create(entry: Omit<StopListEntry, 'id'>): Promise<StopListEntry>;
  findById(id: string): Promise<StopListEntry | null>;
  findByDishId(dishId: string): Promise<StopListEntry[]>;
  findAll(): Promise<StopListEntry[]>;
  update(id: string, data: Partial<StopListEntry>): Promise<StopListEntry>;
}