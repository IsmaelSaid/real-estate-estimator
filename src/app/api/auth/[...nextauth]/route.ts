import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { POST } from '@/app/api/signin/route.ts'

const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {},
            async authorize(credentials) {
                const { email, password } = credentials as { email: string, password: string }
                const requestObj = {
                    json: async () => ({ email, password }),
                } as Request;
                const response = await POST(requestObj);
                const responseBody = await response.json();
                if (response.status === 200) {
                    const userCredentials: {
                        email: string,
                        name: string,
                        firstname: string,
                        lastname: string
                        username: string
                    } = responseBody.user
                    return { id: userCredentials.email, email: userCredentials.email, lastname: userCredentials.lastname, firstname: userCredentials.firstname, name: userCredentials.name, username: userCredentials.username }
                }
                throw Error('invalid credentials')
            }
        })
    ],
    pages: {
        signIn: '/signin'
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        session: ({ session, token }) => ({ ...session, user: token }),
        jwt: async ({ user, token }) => {
            if (user) {
                token.idToken = user.id
                token.firstname = user.firstname
                token.lastname = user.lastname
                token.mail = user.email
                token.username = user.username
            }
            return token;
        },
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }