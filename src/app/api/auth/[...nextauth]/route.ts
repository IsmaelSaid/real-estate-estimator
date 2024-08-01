import NextAuth, {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {POST} from '@/app/api/signin/route.ts'

const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {},
            async authorize(credentials) {
                const {email, password} = credentials as { email: string, password: string }
                const requestObj = {
                    json: async () => ({email, password}),
                } as Request;
                const response = await POST(requestObj);
                const responseBody = await response.json();
                if (response.status === 200) {
                    const userCredentials: {
                        email: string,
                        name: string,
                        nickname: string,
                        username: string
                    } = responseBody.user
                    return {id: userCredentials.email, email: userCredentials.email, name: userCredentials.name}
                }
                throw Error('invalid credentials')
            }
        })
    ],
    pages: {
        signIn: '/signin'
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}