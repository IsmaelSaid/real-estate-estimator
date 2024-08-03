"use client";

import * as React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Avatar } from "@mui/material";
import { Dropdown, DropdownItem, DropdownMenu, DropdownHeader } from "semantic-ui-react";
import { usePathname } from 'next/navigation'


export default function AppBarComponent({ isAppBarLocked = false }: { isAppBarLocked?: boolean }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  React.useEffect((



  ) => { }, [])
  return (<>
    {status !== 'loading' && <nav
      className={
        " bg-gray-50 backdrop-blur-lg shadow fixed w-full z-50 h-16 top-0 left-0 bg-blue-500 flex justify-between items-center h-20 py-5 px-5"
      }
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.1 }} className={"w-full ml-20 mr-20 flex justify-between items-center"}>
        <div className={"text-black"}>
          <Link className={`text-gray-500 pr-3 ${pathname === '/' && 'text-blue-600'}`} href="/">
            Home
          </Link>
          <Link className={`text-gray-500 pr-3 ${pathname === '/prediction' && 'text-blue-600'}`} href="/prediction">
            Predict
          </Link>
          {status === 'authenticated' && !isAppBarLocked && (
            <>
              <Link className={`text-gray-500 pr-3 ${pathname === '/dashboard' && 'text-blue-600'}`} href="/dashboard">
                Dashboard
              </Link>
              <Link className={`text-gray-500 pr-3 ${pathname === '/experiment' && 'text-blue-600'}`} href="/experiment">
                Experiment
              </Link>
            </>
          )}
        </div>
        <div className={"text-gray-500 pr-3"}>
          {status === 'unauthenticated' && (
            <>
              <Link className={"m-2 text-gray-500 pr-3"} href="/signin">
                Sign in{" "}
              </Link>
              <Link className={"m-2 text-gray-500 pr-3"} href="/signup">
                sign up
              </Link>
            </>
          )}
          {status === 'authenticated' && !isAppBarLocked && (
            <div>
              <Dropdown closeOnBlur trigger={<Avatar {...stringAvatar(`${session.user.lastname} ${session.user.firstname}`)} />
              }>
                <DropdownMenu direction="left"
                >
                  <DropdownHeader content={`${session.user.lastname} ${session.user.firstname}`} />

                  <DropdownItem text='Logout' onClick={() => signOut({ redirect: true, callbackUrl: "/logout" })} />
                </DropdownMenu>
              </Dropdown>
            </div>

          )}
        </div>
      </motion.div>
    </nav >}</>
  );
}

function stringToColor(string: string) {
  // From material ui
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}