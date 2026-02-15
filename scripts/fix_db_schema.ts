import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Altering table "Alert" to allow NULL values in "circleId"...');
        // Using raw SQL to bypass prisma migration engine issues
        // For PostgreSQL: ALTER TABLE "Alert" ALTER COLUMN "circleId" DROP NOT NULL;
        await prisma.$executeRawUnsafe(`ALTER TABLE "Alert" ALTER COLUMN "circleId" DROP NOT NULL;`);
        console.log('Successfully altered "Alert" table.');
    } catch (error) {
        console.error('Error executing raw SQL:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
