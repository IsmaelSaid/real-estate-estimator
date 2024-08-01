import {NextResponse} from "next/server";
import prisma from "../../../../prisma/prisma.ts";

export const GET = async () => {
    try {
        const mutations = await prisma.mutation.findMany();
        return NextResponse.json(mutations);
    } catch (e) {
        return NextResponse.json({error: `Internal server error${e}`}, {status: 500});
    }
}