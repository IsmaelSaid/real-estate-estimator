'use client'
import * as React from 'react';
import Link from "next/link";
import {signOut, useSession} from "next-auth/react";


export default function AppBarComponent() {
    const {data: session} = useSession()
    return (
        <nav className={'fixed w-full z-50 h-16 top-0 left-0 bg-blue-500 flex justify-between items-center h-auto py-5 px-5'}>
            <div className={'text-white'}>
                <Link className={' text-white'} href="/">HOME</Link>
                {session && <>
                    <Link className={'m-2 text-white'} href="/dashboard">DASHBOARD</Link>
                    <Link className={'m-2 text-white'} href="/prediction">PREDICTION</Link>
                    <Link className={'m-2 text-white'} href="/contest">CONTEST</Link></>}
            </div>
            <div className={'text-white'}>
                {!session && <>
                    <Link className={'m-2 text-white'} href="/signin">SIGNIN </Link>
                    <Link className={'m-2 text-white'} href="/signup">SIGNUP</Link></>
                }
                {session && <div>
                    <span className={'m-2 text-white'}>
                        {session?.user?.name}
                    </span>
                    <button className={''} onClick={() => signOut({redirect: true, callbackUrl: '/'})}>SIGNOUT</button>
                </div>}
            </div>
        </nav>
    )

}
