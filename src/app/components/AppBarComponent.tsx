'use client'
import * as React from 'react';
import Link from "next/link";
import {signOut, useSession} from "next-auth/react";


export default function AppBarComponent() {
    const {data: session} = useSession()
    return (
        <nav className={' bg-gray-50 backdrop-blur-lg shadow fixed w-full z-50 h-16 top-0 left-0 bg-blue-500 flex justify-between items-center h-auto py-5 px-5'}>
            <div className={'w-full ml-20 mr-20 flex justify-between'}>
            <div className={'text-black'}>
                <Link className={' text-black'} href="/">HOME</Link>
                {session && <>
                    <Link className={'m-2 text-black'} href="/dashboard">DASHBOARD</Link>
                    <Link className={'m-2 text-black'} href="/prediction">PREDICTION</Link>
                    <Link className={'m-2 text-black'} href="/contest">CONTEST</Link></>}
            </div>
            <div className={'text-black'}>
                {!session && <>
                    <Link className={'m-2 text-black'} href="/signin">SIGNIN </Link>
                    <Link className={'m-2 text-black'} href="/signup">SIGNUP</Link></>
                }
                {session && <div>
                    <span className={'m-2 text-black'}>
                        {session?.user?.name}
                    </span>
                    <button className={''} onClick={() => signOut({redirect: true, callbackUrl: '/'})}>SIGNOUT</button>
                </div>}
            </div>
            </div>
        </nav>
    )

}
