'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogoutComponent() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push('/');
        }, 2000);
    }, [router]);

    return (
        <div
            className={
                "w-full h-full pt-16 mx-auto flex justify-center items-center"
            }
        >            <p>Successfuly logout</p>
        </div>
    );
}