import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { User } from "@prisma/client";
import prisma from "@/app/prisma/prisma";

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
        const { email, firstname, lastname, username, password } = body
        console.info(email, firstname, lastname, username, password)


        // Check if all required fields are present
        if (!email || !firstname || !lastname || !username || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 500 });
        }

        // Check if the email already exists in the database
        const user1: User | null = await prisma.user.findUnique({
            where: { email }
        })
        if (user1) {
            return NextResponse.json({ error: 'This email already exists' }, { status: 500 });
        }

        // Check if the email already exists in the database
        const user2: User | null = await prisma.user.findUnique({
            where: { username }
        })
        if (user2) {
            return NextResponse.json({ error: 'This username already exists' }, { status: 500 });
        }

        // Hash the password before storing it in the database
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the new user in the database
        const newUser = await prisma.user.create({
            data: {
                email,
                firstname,
                lastname,
                username,
                password: hashedPassword
            }
        })

        // Return a success response with the created user
        return NextResponse.json({ message: 'ok', createdUser: newUser }, { status: 201 });
    } catch (e) {
        // Return an error response in case of any exceptions
        return NextResponse.json({ error: 'Internal server error' + e }, { status: 500 });
    }
}