import prisma from "@/app/prisma/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const mutations = await prisma.mutation.findMany();
        return NextResponse.json(mutations);
    } catch (e) {
        return NextResponse.json({ error: `Internal server error${e}` }, { status: 500 });
    }
}