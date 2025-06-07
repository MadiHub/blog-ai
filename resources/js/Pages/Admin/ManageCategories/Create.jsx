import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage, useForm, Link, router } from '@inertiajs/react'
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function ManageUsersCreate() {
    // PROPS ERROR
    const { errors } = usePage().props
    // PROPS ERROR END
    const [selectedImage, setSelectedImage] = useState(null);

    // SETUP FORM
    const { data, setData } = useForm({
        name: '',
        image: '',
    });

    function submit(e) {
        e.preventDefault();
        router.post("/dashboard/categories/", data);
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result);
        };
        reader.readAsDataURL(file);
        setData('image', file);
        }
    };

    return (
    <>
        <AdminLayout>
            <div className="max-w-lg mx-auto bg-secondary-background p-8 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-4 mt-4">
                    <h2 className="text-3xl font-bold text-white">Create Category</h2>
                    <div className="flex justify-start md:justify-end mt-2 md:mt-0">
                        <Link href={'/dashboard/categories/'} className="bg-primary-btn hover:bg-secondary-btn px-4 py-2 rounded-3xl transition cursor-pointer">
                            <i className="fa-solid fa-arrow-left text-primary-text font-bold"></i>
                        </Link>
                    </div>
                </div>

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
                        <label htmlFor="image" className="block text-sm font-medium text-secondary-text mb-1">Icon</label>
                        <div className="grid justify-end mb-2">
                            {selectedImage ? (
                            <img src={selectedImage} alt="Image" className="w-20" />
                            ) : (
                            <img src="/storage/Images/Blank/blank.jpg" alt="Blank IMG" className="w-20 rounded-lg" />
                            )}
                        </div>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleImageChange}
                            className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
                        />
                        {errors.image &&
                            <div className="alert text-red-500 text-xs mt-2">
                                {errors.image}
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
