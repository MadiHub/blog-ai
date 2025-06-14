import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage, useForm, Link, router } from '@inertiajs/react'
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function ManagePostTypeShow({post_type, seo}) {
    const [selectedIcon, setSelectedIcon] = useState(null);

    // SETUP FORM
    const { data, setData } = useForm({
        name: post_type.name,
        description: post_type.description,
        icon: '',
    });
    // SETUP FORM END

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedIcon(reader.result);
        };
        reader.readAsDataURL(file);
        setData('icon', file);
        }
    };

    return (
    <>
        <Head>
            <link rel="icon" href={`/storage/Images/Favicon/${seo.favicon}`} type="image/x-icon" />
            <meta name="robots" content="noindex, nofollow" />
            <meta itemprop="name" content={seo.brand_name} />
            <meta itemprop="description" content={seo.description} />
            <meta itemprop="image" content={`/storage/Images/BrandLogo/${seo.brand_logo}`} />
            <title>Post Type</title>
        </Head>
        <AdminLayout>
            <div className="max-w-lg mx-auto bg-secondary-background p-8 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-4 mt-4">
                    <h2 className="text-3xl font-bold text-white">Detail Post Type</h2>
                    <div className="flex justify-start md:justify-end mt-2 md:mt-0">
                        <Link href={'/dashboard/post/types/'} className="bg-primary-btn hover:bg-secondary-btn px-4 py-2 rounded-3xl transition cursor-pointer">
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
                            className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text bg-gray-700 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-secondary-text mb-1">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            placeholder="..."
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text bg-gray-700 cursor-not-allowed"
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="icon" className="block text-sm font-medium text-secondary-text mb-1">Icon</label>
                        <div className="grid justify-end mb-2">
                            {selectedIcon ? (
                            <img src={selectedIcon} alt="icon" className="w-20" />
                            ) : (
                             post_type.icon && <img src={`/storage/Images/PostTypes/${post_type.icon}`} alt={post_type.slug} className="w-20 rounded-lg" />
                            )}
                        </div>
                        <input
                            type="file"
                            id="icon"
                            name="icon"
                            disabled
                            onChange={handleIconChange}
                            className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text bg-gray-700 cursor-not-allowed"
                        />
                    </div>
                </form>
            </div>
        </AdminLayout>
    </>
  );
}
