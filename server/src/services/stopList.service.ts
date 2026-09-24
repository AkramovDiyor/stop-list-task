import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '../domain/errors';
import { isActive, toView } from '../domain/stopList';

export class StopListService {
  constructor(
    private prisma: PrismaClient,
    private getNow: () => Date = () => new Date()
  ) {}

  async stopDish(input: { dishId: string; reason: string; durationMinutes: number }) {
    const dish = await this.prisma.dish.findUnique({ where: { id: input.dishId } });
    if (!dish) throw new NotFoundError('Блюдо не найдено в справочнике');

    const now = this.getNow();
    const activeEntries = await this.prisma.stopListEntry.findMany({
      where: { dishId: input.dishId, returnedAt: null, expiresAt: { gt: now } }
    });

    if (activeEntries.length > 0) {
      throw new ConflictError('Это блюдо уже находится в стоп-листе');
    }

    const expiresAt = new Date(now.getTime() + input.durationMinutes * 60_000);

    return this.prisma.stopListEntry.create({
      data: {
        dishId: input.dishId,
        reason: input.reason.trim(),
        stoppedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      },
      include: { dish: true }
    });
  }

  async getActive(category?: string) {
    const now = this.getNow();
    const where: any = { returnedAt: null, expiresAt: { gt: now } };
    if (category && category !== 'Все') where.dish = { category };

    const entries = await this.prisma.stopListEntry.findMany({ 
      where, 
      include: { dish: true },
      orderBy: { stoppedAt: 'desc' }
    });
    return entries.map(e => toView(e, now));
  }

  async returnDish(id: string) {
    const entry = await this.prisma.stopListEntry.findUnique({ where: { id }, include: { dish: true } });
    if (!entry) throw new NotFoundError('Запись стоп-листа не найдена');
    
    if (!isActive(entry, this.getNow())) {
      throw new ConflictError('Запись уже неактивна (истекла или возвращена ранее)');
    }

    return this.prisma.stopListEntry.update({
      where: { id },
      data: { returnedAt: this.getNow().toISOString() },
      include: { dish: true }
    });
  }

  async getHistory(limit: number, offset: number) {
    const now = this.getNow();
    const where = {
      OR: [{ returnedAt: { not: null } }, { expiresAt: { lte: now } }]
    };

    const [items, total] = await Promise.all([
      this.prisma.stopListEntry.findMany({
        where,
        include: { dish: true },
        orderBy: { stoppedAt: 'desc' },
        skip: offset,
        take: limit
      }),
      this.prisma.stopListEntry.count({ where })
    ]);

    return {
      items: items.map(e => toView(e, now)),
      total,
      limit,
      offset
    };
  }
}