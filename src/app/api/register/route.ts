import {NextResponse} from "next/server";
import prisma from "../../../../prisma/prisma";
import bcrypt from 'bcrypt';
import {User} from "@prisma/client";

/**
 * POST handler for the register route.
 * This function handles the creation of a new user.
 *
 * @param {Request} request - The incoming request object.
 * @return {NextResponse} - The response object.
 *
 * @throws {NextResponse} - Throws an error if the email already exists or if there are missing fields.
 */
export async function POST(request: Request) {
    try {
        // Parse the request body to get the user details
        const body: User = await request.json();
        const {email, name, nickname, username, password} = body

        // Check if all required fields are present
        if (!email || !name || !nickname || !username) {
            return NextResponse.json({error: 'Missing '}, {status: 500});
        }

        // Check if the email already exists in the database
        const user: User | null = await prisma.user.findUnique({
            where: {email}
        })
        if (user) {
            return NextResponse.json({error: 'This email already exists'}, {status: 500});
        }

        // Hash the password before storing it in the database
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the new user in the database
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                nickname,
                username,
                password: hashedPassword
            }
        })

        // Return a success response with the created user
        return NextResponse.json({message: 'ok', createdUser: newUser}, {status: 200});
    } catch (e) {
        // Return an error response in case of any exceptions
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}