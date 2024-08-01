'use client'
import { useState } from 'react';
import { signIn } from "next-auth/react";
import AppBarComponent from "@/app/components/AppBarComponent";
import { Button, Input } from "semantic-ui-react";

/**
 * LoginForm is a functional component that renders a login form.
 * It uses React's useState hook to manage the form's state (email and password).
 * It also defines a handleSubmit function that is called when the form is submitted.
 *
 * @returns A JSX element representing the login form.
 */
export function LoginForm() {
    // State variables for the email and password fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    /**
     * Handles the form submission event.
     * Prevents the default form submission behavior and logs the email and password to the console.
     *
     * @param {Event} e - The form submission event
     */
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.info('email', email)
        console.info('password', password)
        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
                callbackUrl: '/'
            })
            console.info(res)

        } catch (e) {
            console.info('error')
        }

    }
    return (
        <div className={'h-full flex flex-col'}>
            <AppBarComponent />
            <div className={'flex justify-center flex-col items-center h-full bg-gray-50 dark:bg-gray-900'}>
                <form onSubmit={handleSubmit} className={'flex flex-col bg-white border p-10 shadow'}>
                    <h1 className={'text-2xl font-bold mb-10'}>Sign in to your account</h1>
                    <div className={'mb-10'}>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your
                            email</label>
                        <input id={'username_field'} name={'username_field'} className={'w-80 p-4 rounded border'}
                            placeholder={'Email'}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={'mb-10'}>
                        <label htmlFor="Password"
                            className="block mb-2 text-sm font-medium text-gray-900">Your
                            password</label>
                        <input id={'password_field'} name={'password_field'} className={'w-80 p-4 rounded border'}
                            placeholder={'Password'} type={'password'}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button className={'mb-10 bg-blue-500 shadow p-3 rounded text-white'} type={"submit"}>Sign in</button>
                    <p className="text-sm font-light text-gray-500 ">
                        Don’t have an account yet? <a href="/signup" className="font-medium text-primary-600 hover:underline">Sign
                            up</a>
                    </p>
                </form>

            </div>
        </div>)
}

export default LoginForm;