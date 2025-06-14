import React, { useState, useEffect } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage, Link } from '@inertiajs/react'
import Swal from 'sweetalert2';

export default function DashboardIndex({ seo, totalPosts, totalCategories, totalReaders }) {

    // SWEETALERT
    const { flash } = usePage().props;

    const [shownAlert, setShownAlert] = useState(false);

    // ALERT
    useEffect(() => {
        if (!shownAlert && (flash.success || flash.info || flash.error)) {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener("mouseenter", Swal.stopTimer);
                    toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
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
            setShownAlert(true);
        }
    }, [flash, shownAlert]);
    // ALERT END

    // `handleDelete` function ini tampaknya lebih cocok untuk halaman daftar kategori atau post,
    // bukan dashboard. Saya akan menghapusnya dari sini untuk menjaga fokus dashboard.
    // Jika Anda butuh fungsi delete di dashboard untuk kasus khusus, bisa dipertimbangkan lagi.

    return (
        <>
            <Head>
                <link rel="icon" href={`/storage/Images/Favicon/${seo.favicon}`} type="image/x-icon" />
                <meta name="robots" content="noindex, nofollow" />
                <meta itemProp="name" content={seo.brand_name} />
                <meta itemProp="description" content={seo.description} />
                <meta itemProp="image" content={`/storage/Images/BrandLogo/${seo.brand_logo}`} />
                <title>Dashboard Admin</title>
            </Head>
            <AdminLayout>
                <div className="max-w-full mx-auto p-6 lg:p-8 text-primary-text">
                    <h1 className="text-3xl font-bold text-primary-text mb-8">Dashboard Overview</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Card: Total Posts */}
                        <div className="bg-secondary-background border border-secondary-btn rounded-lg shadow-md p-6 flex flex-col items-start">
                            <div className="text-5xl font-extrabold text-primary-btn mb-2">
                                {totalPosts}
                            </div>
                            <h3 className="text-xl font-semibold text-primary-text mb-1">Post</h3>
                            <p className="text-secondary-text">Jumlah semua postingan yang diterbitkan.</p>
                            <Link href="" className="mt-4 text-primary-btn hover:underline text-sm font-medium">
                                Kelola Postingan &rarr;
                            </Link>
                        </div>

                        {/* Card: Total Categories */}
                        <div className="bg-secondary-background border border-secondary-btn rounded-lg shadow-md p-6 flex flex-col items-start">
                            <div className="text-5xl font-extrabold text-primary-btn mb-2">
                                {totalCategories}
                            </div>
                            <h3 className="text-xl font-semibold text-primary-text mb-1">Category</h3>
                            <p className="text-secondary-text">Kategori yang digunakan untuk mengorganisir post.</p>
                            <Link href="" className="mt-4 text-primary-btn hover:underline text-sm font-medium">
                                Kelola Kategori &rarr;
                            </Link>
                        </div>

                        {/* Card: Total Readers (Users) */}
                        <div className="bg-secondary-background border border-secondary-btn rounded-lg shadow-md p-6 flex flex-col items-start">
                            <div className="text-5xl font-extrabold text-primary-btn mb-2">
                                {totalReaders}
                            </div>
                            <h3 className="text-xl font-semibold text-primary-text mb-1">Reader</h3>
                            <p className="text-secondary-text">Jumlah pengguna terdaftar.</p>
                            <Link href="" className="mt-4 text-primary-btn hover:underline text-sm font-medium">
                                Lihat Semua User &rarr;
                            </Link>
                        </div>
                    </div>

                    {/* Bagian Opsional: Informasi Lain atau Statistik Sederhana */}
                    <div className="mt-10 bg-secondary-background border border-secondary-btn rounded-lg shadow-md p-6">
                        <h3 className="text-2xl font-bold text-primary-text mb-4">Quick Insights</h3>
                        <p className="text-secondary-text leading-relaxed">
                           Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde incidunt, praesentium quod minima delectus deleniti doloremque consectetur vel enim eos iure laborum, autem laudantium architecto iusto! Eos doloremque dolorem optio.
                        </p>
                    </div>

                </div>
            </AdminLayout>
        </>
    );
}