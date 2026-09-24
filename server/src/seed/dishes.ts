// server/src/seed/dishes.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dishes = [
  // Кухня
  { name: 'Борщ с пампушками', category: 'Кухня', price: 450 },
  { name: 'Цезарь с курицей', category: 'Кухня', price: 520 },
  { name: 'Стейк Рибай', category: 'Кухня', price: 1800 },
  { name: 'Паста Карбонара', category: 'Кухня', price: 590 },
  // Бар
  { name: 'Лимонад домашний', category: 'Бар', price: 250 },
  { name: 'Пиво светлое 0.5', category: 'Бар', price: 300 },
  { name: 'Вино красное (бокал)', category: 'Бар', price: 450 },
  { name: 'Кофе Американо', category: 'Бар', price: 180 },
  // Десерты
  { name: 'Чизкейк Нью-Йорк', category: 'Десерты', price: 350 },
  { name: 'Тирамису', category: 'Десерты', price: 390 },
  { name: 'Шоколадный фондан', category: 'Десерты', price: 420 },
  { name: 'Мороженое ассорти', category: 'Десерты', price: 280 },
];

async function main() {
  console.log('🌱 Starting seed...');
  
  // Очищаем старые данные (порядок важен из-за внешних ключей)
  await prisma.stopListEntry.deleteMany();
  await prisma.dish.deleteMany();

  // Создаем новые блюда
  for (const dish of dishes) {
    await prisma.dish.create({ data: dish });
  }

  console.log('✅ Seeded 12 dishes successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });