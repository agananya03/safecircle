const { PrismaClient } = require('@prisma/client');

const connectionString = 'postgresql://postgres.pviruytbtxltzmtyuhlt:Ananyagarg30@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: connectionString
        }
    }
});

async function main() {
    try {
        const count = await prisma.user.count();
        console.log(`User count: ${count}`);
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
