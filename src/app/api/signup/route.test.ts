/**
 * @jest-environment node
 */

import {POST} from './route'
import {execSync} from "child_process";
import prisma from "../../../../prisma/prisma";
import {User} from "@prisma/client";

describe("/api/register is considered functional if ", () => {
    const newUser = {email: 'janedoe@mail.com', firstname: 'Jane', lastname: 'Doe', username: 'Jandice', password: 'azerty'}
    beforeAll(() => {
        const command = 'npm run seed:dev';
        try {
            const output = execSync(command, {stdio: 'inherit'});
        } catch (error) {
            console.error(`Error"${command}":`, error);
        }
    })
    afterAll(() => {
        const command = 'npm run clear:dev';
        try {
            const output = execSync(command, {stdio: 'inherit'});
        } catch (error) {
            console.error(`Error"${command}":`, error);
        }
    })

    describe("POST to /api/register with all fields supplied", () => {
        test(`returns the status code 201`, async () => {
            const requestObj = {
                json: async () => (newUser),
            } as Request;
            const response = await POST(requestObj);
            expect(response.status).toBe(201);
        })

        test(`adds the user to the database`, async () => {
            const user: User | null = await prisma.user.findUnique({
                where: {email : newUser.email}
            })
            expect(user).toBeDefined()
            expect(user?.email).toBe(newUser.email)
            expect(user?.username).toBe(newUser.username)
            expect(user?.lastname).toBe(newUser.lastname)
            expect(user?.firstname).toBe(newUser.firstname)
        })
    })

    describe("POST to /api/register with missing fields", () => {
        test(`missing email field returns the status code 500 `, async () => {
            const newUser = {name: 'Jane', nickname: 'Doe', username: 'Jandice', password: 'azerty'}
            const requestObj = {
                json: async () => (newUser),
            } as Request;
            const response = await POST(requestObj);
            expect(response.status).toBe(500);
        })

        test(`missing name field returns the status code 500 `, async () => {
            const newUser = {email: 'janedoe@mail.com', nickname: 'Doe', username: 'Jandice', password: 'azerty'}
            const requestObj = {
                json: async () => (newUser),
            } as Request;
            const response = await POST(requestObj);
            expect(response.status).toBe(500);
        })

        test(`missing nickname field returns the status code 500 `, async () => {
            const newUser = {email: 'janedoe@mail.com', name: 'Jane', username: 'Jandice', password: 'azerty'}
            const requestObj = {
                json: async () => (newUser),
            } as Request;
            const response = await POST(requestObj);
            expect(response.status).toBe(500);
        })

        test(`missing username field returns the status code 500 `, async () => {
            const newUser = {email: 'janedoe@mail.com', name: 'Jane', nickname: 'Doe', password: 'azerty'}
            const requestObj = {
                json: async () => (newUser),
            } as Request;
            const response = await POST(requestObj);
            expect(response.status).toBe(500);
        })

        test(`missing password field returns the status code 500 `, async () => {
            const newUser = {email: 'janedoe@mail.com', name: 'Jane', nickname: 'Doe', username: 'Jandice'}
            const requestObj = {
                json: async () => (newUser),
            } as Request;
            const response = await POST(requestObj);
            expect(response.status).toBe(500);
        })
    })
});