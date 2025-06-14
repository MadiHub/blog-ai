import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage, useForm, Link, router } from '@inertiajs/react'
import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

export default function ManageUsersCreate({seo}) {
    // PROPS ERROR
    const { errors } = usePage().props
    // PROPS ERROR END

    // SETUP FORM
    const { data, setData } = useForm({
        name: '',
        username: '',
        email: '',
        role: '',
        password: '',
    });

    function submit(e) {
        e.preventDefault();
        router.post("/dashboard/users/", data);
    }
    // SETUP FORM END

    function generateUser() {
        fetch('/dashboard/users/generate')
        .then(res => res.json())
        .then(data => {
            setData('name', data.name);
            setData('username', data.username);
            setData('email', data.email);
        })
        .catch(err => {
            console.error('Failed to generate user:', err);
        });
    }

    // ALERT
    const { flash } = usePage().props;

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
            <meta name="robots" content="noindex, nofollow" />
            <meta itemprop="name" content={seo.brand_name} />
            <meta itemprop="description" content={seo.description} />
            <meta itemprop="image" content={`/storage/Images/BrandLogo/${seo.brand_logo}`} />
            <title>Dashboard Users</title>
        </Head>
        <AdminLayout>
            <div className="max-w-lg mx-auto bg-secondary-background p-8 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-4 mt-4">
                    <h2 className="text-3xl font-bold text-primary-text">Create Users</h2>
                    <div className="flex justify-start md:justify-end mt-2 md:mt-0">
                        <Link href={'/dashboard/users/'} className="bg-primary-btn hover:bg-secondary-btn px-4 py-2 rounded-3xl transition cursor-pointer">
                            <i className="fa-solid fa-arrow-left text-primary-text font-bold"></i>
                        </Link>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={generateUser}
                    className="flex mb-4 items-center justify-center bg-orange-500 text-primary-text font-bold py-1 px-4 rounded-lg hover:bg-orange-600 transition-all duration-200 cursor-pointer"
                >
                    <i className="fas fa-sync-alt mr-2"></i>
                        Generate User
                </button>
                <form className="space-y-6" onSubmit={submit}>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-secondary-text mb-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
                        />
                        {errors.name &&
                            <div className="alert text-red-500 text-xs mt-2">
                                {errors.name}
                            </div>
                        }
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-secondary-text mb-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={data.username}
                            onChange={e => setData('username', e.target.value)}
                            className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
                        />
                        {errors.username &&
                            <div className="alert text-red-500 text-xs mt-2">
                                {errors.username}
                            </div>
                        }
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary-text mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
                        />
                        {errors.email &&
                            <div className="alert text-red-500 text-xs mt-2">
                                {errors.email}
                            </div>
                        }
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-secondary-text mb-1">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={data.role}
                            onChange={e => {
                                const selectedRole = e.target.value;
                                setData('role', selectedRole);

                                if (selectedRole === 'admin') {
                                    setData('password', 'admin123');
                                } else if (selectedRole === 'author') {
                                    setData('password', 'author123');
                                } else if (selectedRole === 'reader') {
                                    setData('password', 'reader123');
                                } else {
                                    setData('password', '');
                                }
                            }}
                            className="w-full px-4 py-2 border border-secondary-text rounded-lg bg-secondary-background transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="author">Author</option>
                            <option value="reader">Reader</option>
                        </select>
                        {errors.role &&
                            <div className="alert text-red-500 text-xs mt-2">
                                {errors.role}
                            </div>
                        }
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-secondary-text mb-1">Password Default</label>
                        <input
                            type="text"
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            disabled
                            className="w-full px-4 py-2 bg-primary-background cursor-not-allowed border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
                        />
                        {errors.password &&
                            <div className="alert text-red-500 text-xs mt-2">
                                {errors.password}
                            </div>
                        }
                    </div>

                    <div className="mt-15">
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center bg-primary-btn text-primary-text font-bold py-2 px-4 rounded-lg hover:bg-secondary-btn transition-all duration-200 cursor-pointer"
                        >
                            <i className="fa-solid fa-plus mr-2"></i>
                            <span>Create</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    </>
  );
}
