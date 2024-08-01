import {NextResponse} from "next/server";
import {buildOppdnDataSoftUrl} from "@/app/utils/utils";

export const POST = async (request: Request) => {
    const body: { search: string } = await request.json();

    try {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }
        const url = buildOppdnDataSoftUrl(body.search)

        const response = await fetch(url, options)
        if (response.ok) {
            return NextResponse.json(await response.json(), {status: 200})
        }

    }catch (e) {
        NextResponse.json({res: e}, {status: 500})


    }
}