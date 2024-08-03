'use client'
import { useState } from 'react';
import { signIn } from "next-auth/react";
import AppBarComponent from "@/app/components/AppBarComponent";
import { Button, Input } from "semantic-ui-react";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from "react-hook-form";


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
    /*         const handleSubmit = async (e: any) => {
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
     */

    const schema = z.object({
        email: z.string().email(),
        password: z.string().min(1, 'Password is required'),
    });

    type formFields = z.infer<typeof schema>
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<formFields>({
        resolver: zodResolver(schema), defaultValues: {
            email: email,
            password: password,
        }
    })

    const onSubmit: SubmitHandler<formFields> = async (data) => {
        const { email, password } = data
        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
                callbackUrl: '/'
            })
            if (res?.ok) {
                window.location.href = '/successfullylogin';
            } else {
                setError('root', { message: "Invalid email or password" })
            }


        } catch (e) {
            console.info('error')
        }
    }
    return (
        <div className={'h-full flex flex-col'}>
            <AppBarComponent isAppBarLocked={true} />
            <div className={'flex justify-center flex-col items-center h-full bg-gray-50 dark:bg-gray-900'}>
                <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col bg-white border p-10 `}>
                    <h1 className={'text-2xl font-bold mb-10'}>Sign in to your account</h1>
                    <div className={'mb-10'}>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your
                            email</label>
                        <input id={'email'} className={'w-80 p-4 rounded border'}
                            placeholder={'Email'}
                            {...register('email')}
                            onChange={(e) => setEmail(e.target.value)} />
                        {errors.email ? <p className={'text-red-500'}>{errors.email?.message}</p> : <p className={"text-red-500 invisible"}>error</p>}

                    </div>
                    <div className={'mb-10'}>
                        <label htmlFor="Password"
                            className="block mb-2 text-sm font-medium text-gray-900">Your
                            password</label>
                        <input id={'password'} className={'w-80 p-4 rounded border'}
                            placeholder={'Password'} type={'password'}
                            {...register('password')}
                            onChange={(e) => setPassword(e.target.value)} />
                        {errors.password ? <p className={'text-red-500'}>{errors.password?.message}</p> : <p className={"text-red-500 invisible"}>error</p>}

                    </div>
                    <Button color='green' type={"submit"} disabled={isSubmitting} loading={isSubmitting}>Sign in</Button>
                    {errors.root ? <p className={'text-red-500'}>{errors.root?.message}</p> : <p className={"text-red-500 invisible"}>error</p>}

                    <p className="text-sm font-light text-gray-500 ">
                        Don’t have an account yet? <a href="/signup" className="font-medium text-primary-600 hover:underline">Sign
                            up</a>
                    </p>
                </form>

            </div>
        </div>)
}

export default LoginForm;