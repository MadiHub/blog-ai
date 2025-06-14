import React, { useState, useEffect } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage, Link, router } from '@inertiajs/react'
import Swal from 'sweetalert2';
import axios from 'axios';

export default function ManagePostsIndex({ posts, seo, postTypes }) {
    // Inisialisasi state dengan props 'posts' yang diterima dari Inertia
    const [allPosts, setAllPosts] = useState(posts); // <--- Inisialisasi dari props
    const [filteredPosts, setFilteredPosts] = useState(posts); // <--- Inisialisasi dari props
    const [activePostType, setActivePostType] = useState(null);

    const { flash } = usePage().props;

    // Efek untuk menampilkan flash messages (tetap sama)
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

    // Efek untuk inisialisasi CSRF Token (tetap sama)
    useEffect(() => {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    }, []);

    // Effect untuk mengupdate `allPosts` dan `filteredPosts` ketika props `posts` berubah
    // Ini penting jika Inertia.js mengirimkan data `posts` yang diperbarui setelah CRUD
    useEffect(() => {
        setAllPosts(posts);
        // Penting: Memastikan filteredPosts juga di-update agar sesuai dengan filter aktif
        if (activePostType === 'All' || activePostType === null) {
            setFilteredPosts(posts);
        } else {
            const filtered = posts.filter(post => post.post_type.name === activePostType);
            setFilteredPosts(filtered);
        }
    }, [posts, activePostType]); // Tambahkan activePostType sebagai dependency

    // --- LOGIKA LOCALSTORAGE UNTUK FILTER POST TYPE ---
    useEffect(() => {
        const storedPostType = localStorage.getItem('activePostType');
        const availablePostTypeNames = postTypes ? ['All', ...postTypes.map(type => type.name)] : ['All'];

        let initialActiveType = 'All';

        if (storedPostType && availablePostTypeNames.includes(storedPostType)) {
            initialActiveType = storedPostType;
        } else if (postTypes && postTypes.length > 0 && storedPostType !== 'All') {
            localStorage.setItem('activePostType', 'All');
        }

        setActivePostType(initialActiveType);

        // Filter posts berdasarkan initialActiveType
        if (initialActiveType === 'All') {
            setFilteredPosts(allPosts);
        } else {
            const filtered = allPosts.filter(post => post.post_type.name === initialActiveType);
            setFilteredPosts(filtered);
        }
    // Tambahkan `allPosts` sebagai dependency agar filtering ulang terjadi saat `allPosts` berubah
    }, [postTypes, allPosts]); // <-- Tambahkan allPosts di dependency array

    function handleDelete(id, slug) {
        Swal.fire({
            title: "Are you sure ?",
            text: "This data" + " (" + slug + ") " + " will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete("/dashboard/posts/" + id, {
                    // Tambahkan callback onSuccess untuk memperbarui state
                    onSuccess: () => {
                        // Setelah penghapusan berhasil di backend, perbarui state posts
                        // Data `posts` yang baru akan tersedia melalui `usePage().props.posts`
                        // atau Inertia akan secara otomatis me-render ulang dengan props yang diperbarui.
                        // Namun, untuk jaminan, kita bisa memfilter state lokal kita
                        setAllPosts(prevPosts => prevPosts.filter(post => post.id !== id));

                        // PENTING: Panggil ulang handlePostTypeClick untuk merefresh filteredPosts
                        // agar filter yang sedang aktif diterapkan pada data yang baru saja diperbarui.
                        handlePostTypeClick(activePostType);
                    },
                    onError: (errors) => {
                        console.error("Error deleting post:", errors);
                        Swal.fire('Error!', 'Failed to delete post.', 'error');
                    }
                });
            }
        });
    }

    // Fungsi untuk memfilter posts berdasarkan post type DAN menyimpan ke localStorage (tetap sama)
    const handlePostTypeClick = (postTypeName) => {
        setActivePostType(postTypeName);
        localStorage.setItem('activePostType', postTypeName);

        if (postTypeName === 'All') {
            setFilteredPosts(allPosts);
        } else {
            const filtered = allPosts.filter(post => post.post_type.name === postTypeName);
            setFilteredPosts(filtered);
        }
    };

    return (
        <>
            <Head>
                <link rel="icon" href={`/storage/Images/Favicon/${seo.favicon}`} type="image/x-icon" />
                <meta name="robots" content="noindex, nofollow" />
                <meta itemProp="name" content={seo.brand_name} />
                <meta itemProp="description" content={seo.description} />
                <meta itemProp="image" content={`/storage/Images/BrandLogo/${seo.brand_logo}`} />
                <title>Dashboard Posts</title>
            </Head>
            <AdminLayout>
                <div className="max-w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-4 mt-4">
                        <h2 className="text-2xl font-bold text-primary-text">List Posts</h2>
                        <div className="flex justify-start md:justify-end mt-2 md:mt-0">
                            <Link href={`/dashboard/posts/create?type=${activePostType === 'All' ? '' : activePostType}`} className="bg-primary-btn hover:bg-secondary-btn px-4 py-2 rounded-3xl transition cursor-pointer">
                                <i className="fa-solid fa-plus text-primary-text font-bold"></i>
                            </Link>
                        </div>
                    </div>

                    <div className="shadow-lg rounded-lg max-w-sm md:max-w-full lg:max-w-full overflow-x-auto bg-primary-background">
                        <div className="card-head font-semibold py-5 flex justify-between items-center px-5">
                            <h3 className="text-sm">Filter Posts by Type</h3>
                        </div>
                        <div className="tab grid grid-cols-3 text-wrap md:grid-cols-8 lg:grid-cols-8 gap-3 text-xs font-semibold px-5">
                            <button
                                type="button"
                                onClick={() => handlePostTypeClick('All')}
                                className={`p-2 rounded-[23px] text-center px-4 shadow ${activePostType === 'All' ? 'bg-primary-btn text-primary-text' : 'bg-secondary-background text-secondary-text'}`}
                            >
                                All
                            </button>
                            {postTypes && postTypes.map((type, i) => (
                                <button
                                    type="button"
                                    onClick={() => handlePostTypeClick(type.name)}
                                    className={`p-2 rounded-[23px] text-center px-4 shadow ${activePostType === type.name ? 'bg-primary-btn text-primary-text' : 'bg-secondary-background text-secondary-text'}`}
                                    key={type.slug || i}
                                >
                                    {type.name}
                                </button>
                            ))}
                        </div>
                        <div className="card-body py-5">
                            <table className="min-w-[600px] w-full text-left text-secondary-text">
                                <thead className="bg-secondary-background">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272] text-center">#</th>
                                        <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272] text-center">Thumbnail</th>
                                        <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272] text-center">Title</th>
                                        <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272] text-center">Post Type</th>
                                        <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272] text-center">Category</th>
                                        <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272] text-center">Status</th>
                                        <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272] text-center">Published At</th>
                                        <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272] text-center">Created At | Updated At</th>
                                        <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272] text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPosts.length > 0 ? (
                                        filteredPosts.map((item, i) => (
                                            <tr className="border-t border-[#4F6272] hover:bg-secondary-background transition" key={i}>
                                                <td className="px-4 py-3 text-center align-middle">{i + 1}</td>
                                                <td className="py-3 text-center align-middle">
                                                    <img src={`/storage/Images/Posts/Thumbnails/${item.thumbnail}`} alt={item.slug} className="w-20 shadow-lg inline-block" />
                                                </td>
                                                <td className="px-4 py-3 text-center align-middle">{item.title}</td>
                                                <td className="px-4 py-3 text-center align-middle">{item.post_type.name}</td>
                                                <td className="px-4 py-3 text-center align-middle">{item.category.name}</td>
                                                <td className="py-3 text-center align-middle">{item.status}</td>
                                                <td className="py-3 text-center align-middle">{item.published_at ? item.published_at : '-'}</td>
                                                <td className="px-4 py-3 text-center align-middle">
                                                    {item.created_at}
                                                    <br />
                                                    {item.updated_at}
                                                </td>
                                                <td className="px-4 py-3 text-center align-middle">
                                                    <div className="flex gap-2 items-center justify-center">
                                                        <Link href={`/dashboard/posts/${item.slug}`} className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition whitespace-nowrap cursor-pointer">
                                                            <i className="fa-solid fa-eye"></i>
                                                        </Link>
                                                        <Link href={`/dashboard/posts/${item.slug}/edit?type=${activePostType === 'All' ? '' : activePostType}`} className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition whitespace-nowrap cursor-pointer">
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
                                            <td colSpan="10" className="text-center py-4">No posts found for this type.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}