import { PrismaClient } from '@prisma/client';
import bcrypt from  'bcrypt';
const db = new PrismaClient();

async function main() {
    const email = 'admin@askcraft.com';
    const exists = await db.user.findUnique({ where: { email } });
    if (!exists) {
        const password = await bcrypt.hash('Admin123!', 10);
        await db.user.create({
            data: { email, password, role: 'ADMIN', name: 'Admin' },
        });
    }
}
main().then(()=>process.exit(0)).catch((e)=>{console.error(e);process.exit(1)});