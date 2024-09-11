import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed categories
  const electronicsCategory = await prisma.category.create({
    data: {
      name: 'Electronics',
      subcategories: {
        create: [
          { name: 'Smartphones' },
          { name: 'Laptops' },
          { name: 'Accessories' },
        ],
      },
    },
  });

  const vehiclesCategory = await prisma.category.create({
    data: {
      name: 'Vehicles',
      subcategories: {
        create: [
          { name: 'Cars' },
          { name: 'Motorcycles' },
        ],
      },
    },
  });

  const furnitureCategory = await prisma.category.create({
    data: {
      name: 'Furniture',
      subcategories: {
        create: [
          { name: 'Sofas' },
          { name: 'Tables' },
          { name: 'Chairs' },
        ],
      },
    },
  });

  console.log('Categories and Subcategories seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
