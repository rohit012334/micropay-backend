import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = "admin@micrope.com";
    const adminName = "System Admin";
    const password = "admin_password_123"; // USER should change this later

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.staff.upsert({
        where: { email: adminEmail },
        update: {
            password: hashedPassword,
        },
        create: {
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log(`Admin created/updated: ${admin.email}`);
    console.log(`Default Password: ${password}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
