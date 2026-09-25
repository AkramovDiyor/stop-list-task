import type { Dish, DishCategory } from '../domain/stopList';
import type { DishRepo } from './types';
import { prisma } from './prismaClient';

export const dishRepo: DishRepo = {
  async findById(id: string): Promise<Dish | null> {
    const dish = await prisma.dish.findUnique({ where: { id } });
    if (!dish) return null;
    
    return {
      id: dish.id,
      name: dish.name,
      category: dish.category as DishCategory,
      price: dish.price,
    };
  },

  async findAll(): Promise<Dish[]> {
    const dishes = await prisma.dish.findMany({ orderBy: { name: 'asc' } });
    
    return dishes.map(dish => ({
      id: dish.id,
      name: dish.name,
      category: dish.category as DishCategory,
      price: dish.price,
    }));
  },
};