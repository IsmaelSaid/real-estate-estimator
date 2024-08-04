'use client'
import { useState } from 'react';
import { signIn } from "next-auth/react";
import AppBarComponent from "@/app/components/AppBarComponent";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from 'semantic-ui-react';
/*
https://www.youtube.com/watch?v=cc_xmawJ8Kg
*/

export function SignUpComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [username, setUsername] = useState('');

    const schema = z.object({
        firstname: z.string().min(1, "First name is required").default(firstname),
        lastname: z.string().min(1, "Last name is required").default(lastname),
        username: z.string().min(1, "Username is required"),
        email: z.string().email("Invalid email address"),
        password_check: z.string().min(1, "Password verification is required"),
        password: z.string().min(8, "Password must contain at least 8 characters"),
    }).refine(data => data.password === passwordCheck, {
        message: "Passwords do not match",
        path: ['password_check']
    });

    type formFields = z.infer<typeof schema>
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<formFields>({
        resolver: zodResolver(schema), defaultValues: {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            password: password,
        }
    })
    const onSubmit: SubmitHandler<formFields> = async (data) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const json = await res.json()
        console.info(json)
        if (res.status == 201) {
            await signIn('credentials', {
                email: data.email,
                password: data.password,
                callbackUrl: '/'
            })
        }
        if (json.error === "This email already exists") {
            setError("email", { message: "This email already exists" })
        }
        if (json.error === "This username already exists") {
            setError("username", { message: "This username already exists" })
        }


    }

    return (
        <div className={'h-full flex flex-col'}>
            <AppBarComponent />
            <div
                className={'flex justify-center flex-col items-center h-full bg-gray-50 dark:bg-gray-900 border-t-blue-500'}>
                <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col bg-white border p-10 shadow'}>
                    <h1 className={'text-2xl font-bold mb-10'}>Sign up</h1>
                    <div className={'grid grid-cols-2 gap-4'}>
                        <div className={'mb-2'}>
                            <label htmlFor="firstname" className="block mb-2 text-sm font-medium text-gray-900">First
                                name</label>
                            <input type={"text"}
                                value={firstname}
                                id={'firstname'}
                                className={'p-4 rounded border'}
                                {...register('firstname')}
                                placeholder={'John'} onChange={(e) => setFirstName(e.target.value)} />
                            {errors.firstname ? <p className={'text-red-500'}>{errors.firstname.message}</p> : <p className={"text-red-500 invisible"}>error</p>}
                        </div>
                        <div className={'mb-2'}>
                            <label htmlFor="lastname" className="block mb-2 text-sm font-medium text-gray-900">
                                Last name</label>
                            <input type={"text"} value={lastname} id={'lastname'} className={'p-4 rounded border'}
                                {...register('lastname')}
                                placeholder={'Doe'} onChange={(e) => setLastName(e.target.value)} />
                            {errors.lastname ? <p className={'text-red-500'}>{errors.lastname.message}</p> : <p className={"text-red-500 invisible"}>error</p>}

                        </div>
                    </div>

                    <div className={'mb-2 flex flex-col'}>
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
                            Username</label>
                        <input type={"text"} value={username} id={'username'} className={'p-4 rounded border'}
                            {...register('username')}
                            placeholder={'Johny'} onChange={(e) => setUsername(e.target.value)} />
                        {errors.username ? <p className={'text-red-500'}>{errors.username.message}</p> : <p className={"text-red-500 invisible"}>error</p>}

                    </div>

                    <div className={'mb-2 flex flex-col'}>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                        <input type={"email"} value={email} id={'email'} className={'p-4 rounded border'}
                            placeholder={'Email'}
                            {...register('email')}
                            onChange={(e) => setEmail(e.target.value)} />
                        {errors.email ? <p className={'text-red-500'}>{errors.email.message}</p> : <p className={"text-red-500 invisible"}>error</p>}

                    </div>
                    <div className={'mb-2 flex flex-col'}>
                        <label htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                        <input id={'password'} value={password} className={'p-4 rounded border'}
                            {...register('password')}
                            placeholder={'Password'} type={'password'}
                            onChange={(e) => setPassword(e.target.value)} />
                        {errors.password ? <p className={'text-red-500'}>{errors.password.message}</p> : <p className={"text-red-500 invisible"}>error</p>}

                    </div>
                    <div className={'mb-2 flex flex-col'}>
                        <label htmlFor="password_check"
                            className="block mb-2 text-sm font-medium text-gray-900">Password check</label>
                        <input id={'password_check'}
                            value={passwordCheck}
                            className={'p-4 rounded border'}
                            {...register('password_check')}
                            placeholder={'Password'} type={'password'}
                            onChange={(e) => setPasswordCheck(e.target.value)} />
                        {errors.password_check ? <p className={'text-red-500'}>{errors.password_check.message}</p> : <p className={"text-red-500 invisible"}>error</p>}

                    </div>
                    <Button color='black' loading={isSubmitting} disabled={isSubmitting} type={"submit"}>{isSubmitting ? 'loading' : 'Sign up'}
                    </Button>
                    <p className="text-sm font-light text-gray-500 ">
                        Your already have an account? <a href="/signin"
                            className="font-medium text-primary-600 hover:underline">Sign
                            in</a>
                    </p>
                </form>
            </div>
        </div>)
}

export default SignUpComponent;