import type { StopListEntry } from '../domain/stopList';
import type { StopListRepo } from './types';
import { prisma } from './prismaClient';

export const stopListRepo: StopListRepo = {
  async create(entry: Omit<StopListEntry, 'id'>): Promise<StopListEntry> {
    const created = await prisma.stopListEntry.create({
      data: {
        dishId: entry.dishId,
        reason: entry.reason,
        stoppedAt: new Date(entry.stoppedAt),
        expiresAt: new Date(entry.expiresAt),
        returnedAt: entry.returnedAt ? new Date(entry.returnedAt) : null,
      },
    });

    return {
      id: created.id,
      dishId: created.dishId,
      reason: created.reason,
      stoppedAt: created.stoppedAt.toISOString(),
      expiresAt: created.expiresAt.toISOString(),
      returnedAt: created.returnedAt?.toISOString() ?? null,
    };
  },

  async findById(id: string): Promise<StopListEntry | null> {
    const entry = await prisma.stopListEntry.findUnique({ where: { id } });
    if (!entry) return null;

    return {
      id: entry.id,
      dishId: entry.dishId,
      reason: entry.reason,
      stoppedAt: entry.stoppedAt.toISOString(),
      expiresAt: entry.expiresAt.toISOString(),
      returnedAt: entry.returnedAt?.toISOString() ?? null,
    };
  },

  async findByDishId(dishId: string): Promise<StopListEntry[]> {
    const entries = await prisma.stopListEntry.findMany({
      where: { dishId },
      orderBy: { stoppedAt: 'desc' },
    });

    return entries.map((entry) => ({
      id: entry.id,
      dishId: entry.dishId,
      reason: entry.reason,
      stoppedAt: entry.stoppedAt.toISOString(),
      expiresAt: entry.expiresAt.toISOString(),
      returnedAt: entry.returnedAt?.toISOString() ?? null,
    }));
  },

  async findAll(): Promise<StopListEntry[]> {
    const entries = await prisma.stopListEntry.findMany({
      orderBy: { stoppedAt: 'desc' },
    });

    return entries.map((entry) => ({
      id: entry.id,
      dishId: entry.dishId,
      reason: entry.reason,
      stoppedAt: entry.stoppedAt.toISOString(),
      expiresAt: entry.expiresAt.toISOString(),
      returnedAt: entry.returnedAt?.toISOString() ?? null,
    }));
  },

  async update(id: string, data: Partial<StopListEntry>): Promise<StopListEntry> {
    const updated = await prisma.stopListEntry.update({
      where: { id },
      data: {
        ...(data.returnedAt !== undefined && {
          returnedAt: data.returnedAt ? new Date(data.returnedAt) : null,
        }),
      },
    });

    return {
      id: updated.id,
      dishId: updated.dishId,
      reason: updated.reason,
      stoppedAt: updated.stoppedAt.toISOString(),
      expiresAt: updated.expiresAt.toISOString(),
      returnedAt: updated.returnedAt?.toISOString() ?? null,
    };
  },
};