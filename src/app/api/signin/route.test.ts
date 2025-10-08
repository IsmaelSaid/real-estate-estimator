/**
 * @jest-environment node
 */

import {POST} from './route'
import {execSync} from "child_process";

describe("/api/login is consider functional if ", () => {
    describe('In case of good user credentials', () => {
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

        const goodUserCredential = {email: 'johndoe@mail.com', password: 'securepassword123'}
        it("POST login return a code 200", async () => {
            const requestObj = {
                json: async () => (goodUserCredential),
            } as Request;

            const response = await POST(requestObj);
            expect(response.status).toBe(200);
        });
        it("POST api/login return Login successfull message ", async () => {
            const requestObj = {
                json: async () => (goodUserCredential),
            } as Request;
            const response = await POST(requestObj);
            const responseBody = await response.json();
            const message = responseBody.message;
            expect(message).toBe('Login successful');
        });
        it("POST api/login return the authentified user", async () => {
            const requestObj = {
                json: async () => (goodUserCredential),
            } as Request;
            const response = await POST(requestObj);
            const responseBody = await response.json();
            const userCredentials: {
                email: string,
                firstname: string,
                lastname: string,
                username: string
            } = responseBody.user
            expect(userCredentials.username).toBeDefined()
            expect(userCredentials.firstname).toBeDefined()
            expect(userCredentials.lastname).toBeDefined()
            expect(userCredentials.email).toBe(goodUserCredential.email)
        });
    })

    describe('In case of bad user credentials', () => {
        const credentialsWitheoutPassword = {email: "admin@admin.fr"}
        const credentialsWitheoutUsername = {password: 'admin'}
        it("POST api/login return status code 500 if username missing", async () => {
            const requestObj = {
                json: async () => (credentialsWitheoutUsername),
            } as Request;

            const response = await POST(requestObj);
            expect(response.status).toBe(500);
        });

        it("POST api/login return status code 500 if password is missing", async () => {
            const requestObj = {
                json: async () => (credentialsWitheoutPassword),
            } as Request;
            const response = await POST(requestObj);
            expect(response.status).toBe(500);
        });
    })


});
