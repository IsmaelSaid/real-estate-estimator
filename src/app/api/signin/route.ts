import { NextResponse } from "next/server";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "@/app/prisma/prisma";


export const POST = async (request: Request) => {
    try {
        const body: { email: string, password: string } = await request.json();
        const { email, password } = body
        if (!email || !password) {
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
        const user: User | null = await prisma.user.findUnique({
            where: { email }
        })
        if (!user) {
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
        const result = await bcrypt.compare(password, user.password)

        if (result) {
            const { password, ...userWithoutPassword } = user;
            return NextResponse.json({ message: 'Login successful', user: userWithoutPassword }, { status: 200 });
        }
        return NextResponse.json({ message: 'incorrect email or password' }, { status: 401 });
    } catch (e) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}