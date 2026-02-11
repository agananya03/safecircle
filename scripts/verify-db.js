require('dotenv').config(); // Load .env
require('dotenv').config({ path: '.env.local' }); // Load .env.local override
const { PrismaClient } = require('@prisma/client');

async function main() {
    try {
        console.log('DATABASE_URL length:', process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 'undefined');
        const prisma = new PrismaClient();

        const count = await prisma.user.count();
        console.log(`Database connected. User count: ${count}`);
    } catch (e) {
        console.error('Verification failed:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
