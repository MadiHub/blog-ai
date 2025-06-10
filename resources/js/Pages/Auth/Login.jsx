import { useState } from "react";
import { router, usePage, useForm } from "@inertiajs/react";

export default function Login() {
    const {data, setData} = useForm({
        email_or_username: "",
        password: "",
    });
    
    const { errors } = usePage().props

    function submit(e) {
        e.preventDefault();
        router.post("/login/process", data);
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-secondary-background p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">Login</h2>

        <form className="space-y-6" onSubmit={submit}>
                <>
                <div>
                    <label htmlFor="email_or_username" className="block text-sm font-medium text-secondary-text mb-1">Email Or Username</label>
                    <input
                        type="text"
                        id="email_or_username"
                        name="email_or_username"
                        value={data.email_or_username}
                        onChange={e => setData('email_or_username', e.target.value)}
                        autoComplete="current-email-or-username"
                        className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
                    />
                    {errors.email_or_username &&
                        <div className="alert text-red-500 text-xs mt-2">
                            {errors.email_or_username}
                    </div>
                    }
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-secondary-text mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        autoComplete="current-password"
                        className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
                    />
                    {errors.password &&
                        <div className="alert text-red-500 text-xs mt-2">
                            {errors.password}
                        </div>
                    }
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center bg-primary-btn text-primary-text font-bold py-2 px-4 rounded-lg hover:bg-secondary-btn transition-all duration-200 cursor-pointer"
                    >
                        {/* <i className="fa-solid fa-plus mr-2"></i> */}
                        <span>Login</span>
                    </button>
                </div>
                </>
        </form>
        </div>
    );
}
