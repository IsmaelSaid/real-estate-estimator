'use client';

import {SessionProvider} from 'next-auth/react';
import {ReactNode} from 'react';

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({children}: AuthProviderProps) => <SessionProvider>{children} </SessionProvider>;
export default AuthProvider;
