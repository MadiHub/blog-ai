import AdminLayout from "@/Layouts/AdminLayout";
import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage, useForm, Link, router } from '@inertiajs/react'
import Swal from 'sweetalert2';

export default function ManageUsersShow({user}) {
    // PROPS ERROR
    const { errors } = usePage().props
    // PROPS ERROR END

    // SETUP FORM
    const { data, setData, reset } = useForm({
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
    });


  return (
    <>
        <AdminLayout>
            <div className="max-w-lg mx-auto bg-secondary-background p-8 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-4 mt-4">
                    <h2 className="text-3xl font-bold text-white">Detail Users</h2>
                    <div className="flex justify-start md:justify-end mt-2 md:mt-0">
                        <Link href={'/dashboard/users/'} className="bg-primary-btn hover:bg-secondary-btn px-4 py-2 rounded-3xl transition cursor-pointer">
                            <i className="fa-solid fa-arrow-left text-primary-text font-bold"></i>
                        </Link>
                    </div>
                </div>
                <form className="space-y-6">

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-secondary-text mb-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            disabled
                            className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
                        />
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-secondary-text mb-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={data.username}
                            onChange={e => setData('username', e.target.value)}
                            disabled
                            className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary-text mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            disabled
                            className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-secondary-text mb-1">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={data.role}
                            disabled
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
                    </div>

                </form>
            </div>
        </AdminLayout>
    </>
  );
}
