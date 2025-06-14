import React, { useEffect } from "react";
import { useForm, usePage, router, Head } from "@inertiajs/react";
import Swal from 'sweetalert2';

export default function Login({seo}) {
    const { data, setData } = useForm({
        email_or_username: "",
        password: "",
    });

    const { errors } = usePage().props;

    const submit = (e) => {
        e.preventDefault();
        router.post("/login/process", data);
    };

    // console.log({seo})
    // SWEETALERT
    const { flash } = usePage().props;

    // ALERT 
    useEffect(() => {
        if (flash.success || flash.info || flash.error) {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        let icon = "info";
        let title = flash.info;
        if (flash.success) {
            icon = "success";
            title = flash.success;
        } else if (flash.error) {
            icon = "error";
            title = flash.error;
        }
    
        Toast.fire({ icon, title });
        }
    }, [flash]);
    // ALERT END

    return (
        <>
            <Head>
                <link rel="icon" href={`/storage/Images/Favicon/${seo.favicon}`} type="image/x-icon" />
                <meta itemprop="name" content={seo.brand_name} />
                <meta name="description" content={seo.description} />
                <meta itemprop="image" content={`/storage/Images/BrandLogo/${seo.brand_logo}`} />
                <title>Login</title>
            </Head>
            <div className="min-h-screen flex items-center justify-center bg-primary-background px-4">
                <div className="w-full max-w-md bg-secondary-background border border-secondary-btn shadow-xl rounded-2xl p-8">
                    <h2 className="text-3xl font-bold text-center text-primary-text mb-6">Login</h2>
                

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1">
                                Email atau Username
                            </label>
                            <input
                                type="text"
                                value={data.email_or_username}
                                onChange={(e) => setData("email_or_username", e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border bg-transparent text-secondary-text focus:outline-none focus:ring-1 focus:ring-primary-btn"
                            />
                            {errors.email_or_username && (
                                <p className="text-red-500 text-sm mt-1">{errors.email_or_username}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border bg-transparent text-secondary-text focus:outline-none focus:ring-1 focus:ring-primary-btn"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-primary-btn text-primary-text font-semibold rounded-lg hover:bg-secondary-btn transition"
                        >
                            Login
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <hr className="flex-grow text-gray-300" />
                        <span className="text-secondary-text text-sm">atau</span>
                        <hr className="flex-grow text-gray-300" />
                    </div>

                    <button
                        onClick={() => router.get('/auth/google')}
                        className="w-full flex items-center justify-center gap-3 py-2 bg-white text-secondary-text font-medium rounded-lg hover:bg-gray-100 transition"
                    >
                        <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
                        Login dengan Google
                    </button>

                    <p className="mt-6 text-center text-secondary-text text-sm">
                        Belum punya akun?{" "}
                        <a href="/register" className="text-primary-btn hover:underline font-medium">
                            Daftar sekarang
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
