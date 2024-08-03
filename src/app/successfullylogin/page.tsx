'use client'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SuccessfullyLoginComponent() {
    const router = useRouter();
    const { data: session } = useSession();


    useEffect(() => {
        setTimeout(() => {
            router.push('/');
        }, 2000);
    }, [router]);

    return (
        <div
            className={
                "w-full h-full pt-20 mx-auto flex justify-center items-center"
            }
        >            {session && <p>Successfuly login as {`${session?.user?.firstname} ${session?.user?.lastname}`}</p>}
        </div>
    );
}