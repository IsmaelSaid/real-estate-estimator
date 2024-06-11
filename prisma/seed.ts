import {User} from "@prisma/client";

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
import {POST} from '../src/app/api/register/route'

async function main() {
    await prisma.user.deleteMany();
    const newUser : User = {
        email: 'johndoe@mail.com',
            name: 'John',
            nickname: 'Doe',
            password: 'securepassword123',
            username: 'Johny'
    }

    const requestObj = {
        json: async () => (newUser),
    } as Request;
    const response = await POST(requestObj);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
