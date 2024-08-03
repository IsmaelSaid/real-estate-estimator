import NextAuth from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's postal address. */
            firstname: string
            lastname: string
            mail: string
            username: string

        }
    }
}

import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        /** OpenID ID Token */
        idToken?: string,
        firstname: string | undefined | null,
        lastname: string | undefined | null,
        mail: string | undefined | null
    }
}

declare module 'next-auth' {
    interface User {
        email: string | null | undefined,
        firstname: string | null | undefined,
        lastname: string | null | undefined,
        username: string | null | undefined
    }
}