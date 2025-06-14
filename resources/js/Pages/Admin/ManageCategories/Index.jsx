import React, { useState, useEffect } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage, Link, router } from '@inertiajs/react'
import Swal from 'sweetalert2';
import { ReactSortable } from "react-sortablejs";
import axios from 'axios';

export default function ManageCategoriesIndex({ categories, seo }) {
    // Pastikan categories adalah array, bahkan jika null atau undefined dari props
    // Mengubah nama state agar lebih sesuai dengan konteks
    const [categories_sortable, set_categories_sortable] = useState(categories || []);

    // Sinkronkan state lokal dengan props categories jika props berubah
    // Ini penting agar daftar selalu up-to-date, terutama setelah navigasi Inertia
    useEffect(() => {
        set_categories_sortable(categories || []);
    }, [categories]);

    // SWEETALERT
    const { flash } = usePage().props;
    const [flashSortable, setFlashSortable] = useState({ success: null });

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

        if (flashSortable.success) {
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
            Toast.fire({
                icon: "success",
                title: flashSortable.success,
                customClass: {
                    popup: 'custom-background',
                    title: 'custom-title',
                    content: 'custom-content',
                    confirmButton: 'custom-confirm-button',
                }
            });
        }
    }, [flash, flashSortable]);

    // Inisialisasi CSRF Token Axios
    useEffect(() => {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    }, []);

    // handleSort - disesuaikan untuk kategori
    const handleSort = async (handle_categories_sortable) => {
        const updatedCategoryOperator = handle_categories_sortable.map((category_sort, index) => ({
            id: category_sort.id,
            position: index + 1,
        }));

        try {
            const response = await axios.post('/dashboard/sortable/update-categories-position', {
                data_sortable_categories: updatedCategoryOperator,
            });

            if (response.status === 200) {
                setFlashSortable({ success: response.data.message });
            } else {
                console.error('Gagal memperbarui posisi di server');
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat memperbarui posisi:', error);
        }
    };

    // handleEnd - disesuaikan untuk kategori
    const handleEnd = () => {
        set_categories_sortable((prevSort) => {
            handleSort(prevSort);
            return prevSort;
        });
    };

    // handleDelete - Memperbarui state di frontend setelah penghapusan berhasil
    function handleDelete(id, slug) {
        Swal.fire({
            title: "Are you sure?",
            text: `This data (${slug}) will be deleted!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/dashboard/categories/${id}`, {
                    onSuccess: () => {
                        // Perbarui state lokal setelah penghapusan berhasil di backend
                        set_categories_sortable((prevCategories) =>
                            prevCategories.filter((item) => item.id !== id)
                        );
                        // Tampilkan sweetalert sukses dari flash message Inertia jika ada
                        // Gunakan variabel flash yang sudah dideklarasikan di top level
                        if (flash.success) {
                            Swal.fire({
                                icon: "success",
                                title: flash.success,
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }
                    },
                    onError: (errors) => {
                        // Tangani error jika penghapusan gagal di backend
                        console.error("Failed to delete category:", errors);
                        Swal.fire({
                            icon: "error",
                            title: "Gagal menghapus!",
                            text: "Terjadi kesalahan saat menghapus data.",
                        });
                    }
                });
            }
        });
    }

    return (
        <>
            <Head>
                <link rel="icon" href={`/storage/Images/Favicon/${seo.favicon}`} type="image/x-icon" />
                <meta name="robots" content="noindex, nofollow" />
                <meta itemProp="name" content={seo.brand_name} />
                <meta itemProp="description" content={seo.description} />
                <meta itemProp="image" content={`/storage/Images/BrandLogo/${seo.brand_logo}`} />
                <title>Manage Categories</title>
            </Head>
            <AdminLayout>
                <div className="max-w-full p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-4 mt-4">
                        <h2 className="text-2xl font-bold text-primary-text">List Post Category</h2>
                        <div className="flex justify-start md:justify-end mt-2 md:mt-0">
                            <Link href={'/dashboard/categories/create'} className="bg-primary-btn hover:bg-secondary-btn px-4 py-2 rounded-3xl transition cursor-pointer">
                                <i className="fa-solid fa-plus text-primary-text font-bold"></i>
                            </Link>
                        </div>
                    </div>

                    <div className="shadow-lg rounded-lg max-w-sm md:max-w-full lg:max-w-full overflow-x-auto bg-primary-background">
                        <table className="min-w-[600px] w-full text-left text-secondary-text">
                            <thead className="bg-secondary-background">
                                <tr>
                                    <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272]">#</th>
                                    <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272]">Image</th> {/* Updated from Icon to Image */}
                                    <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272]">Name</th>
                                    <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272]">Slug</th>
                                    <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272]">Description</th>
                                    <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272]">Created At | Updated At</th>
                                    <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272]">Aksi</th>
                                </tr>
                            </thead>
                            <ReactSortable
                                list={categories_sortable} 
                                setList={set_categories_sortable}
                                onEnd={handleEnd}
                                animation={200}
                                tag="tbody"
                            >
                                {categories_sortable.length > 0 ? (
                                    categories_sortable.map((item, i) => (
                                        <tr className="border-t border-[#4F6272] hover:bg-secondary-background transition cursor-grab active:cursor-grabbing" key={item.id}>
                                            <td className="px-4 py-3">{i + 1}</td>
                                            <td className="py-3">
                                                {/* Menggunakan item.image sesuai dengan struktur data kategori */}
                                                <img src={`/storage/Images/Categories/${item.image}`} alt={item.name} className="w-20 shadow-lg" />
                                            </td>
                                            <td className="px-4 py-3">{item.name}</td>
                                            <td className="px-4 py-3">{item.slug}</td>
                                            <td className="px-4 py-3">{item.description}</td>
                                            <td className="px-4 py-3">
                                                {item.created_at}
                                                <br />
                                                {item.updated_at}
                                            </td>
                                            <td className="px-4 py-3 text-center align-middle">
                                                <div className="flex gap-2 items-center justify-center">
                                                    <Link href={`/dashboard/categories/${item.slug}`} className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition whitespace-nowrap cursor-pointer">
                                                        <i className="fa-solid fa-eye"></i>
                                                    </Link>
                                                    <Link href={`/dashboard/categories/${item.slug}/edit`} className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition whitespace-nowrap cursor-pointer">
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.id, item.slug)}
                                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition whitespace-nowrap cursor-pointer"
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">No categories found.</td>
                                    </tr>
                                )}
                            </ReactSortable>
                        </table>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}