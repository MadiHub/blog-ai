import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage, useForm, Link, router } from '@inertiajs/react'
import React, { useEffect, useState, useRef, useCallback, useMemo  } from 'react';
import Swal from 'sweetalert2';
import TagInput from '@/Components/TagInput';
import TipTapEditor from '@/Components/TipTapEditor'; 

export default function ManagePostsCreate({categories, tags, post_types, seo}) {
    const { errors } = usePage().props
    const [selectedImage, setSelectedImage] = useState(null);
    const tagSuggestions = tags.map(tag => tag.name);
    const [localTags, setLocalTags] = useState([]);

    // SETUP FORM
    const { data, setData } = useForm({
        title: '',
        post_type: '',
        category: '',
        thumbnail: '',
        content: '',
        status: '',
        images: [], 
        tags: [],
    });
    console.log(data);

    function submit(e) {
        e.preventDefault();
        router.post("/dashboard/posts/", data);
    }
    // SETUP FORM END

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
        setData('thumbnail', file);
        }
    };

    const handleEditorChange = (html) => {
        setData('content', html);
    };

    const handleImageUploadSuccess = ({ filename, url }) => {
        console.log('Image uploaded successfully:', filename, url);
    };

    const handleImageUploadError = (error) => {
        console.error('Image upload failed:', error);
    };

    const handleImageAddedToContent = (imageUrl) => {
        const filename = imageUrl.split('/').pop(); 
        
        setData(prevData => ({
            ...prevData,
            images: [...prevData.images, filename], 
        }));
        console.log('Filename added to data.images:', filename);
    };

    // INPUT TAGS CHANGE
    const handleTagInputChange = useCallback((val) => {
        setData('tags', val); 
    }, [setData]); 

    useEffect(() => {
        setData('tags', localTags);
    }, [localTags]);

    return (
    <>
        <Head>
            <link rel="icon" href={`/storage/Images/Favicon/${seo.favicon}`} type="image/x-icon" />
            <meta name="robots" content="noindex, nofollow" />
            <meta itemprop="name" content={seo.brand_name} />
            <meta itemprop="description" content={seo.description} />
            <meta itemprop="image" content={`/storage/Images/BrandLogo/${seo.brand_logo}`} />
            <title>Dashboard Posts</title>
        </Head>
        <AdminLayout>
            <div className="max-w-6xl mx-auto bg-secondary-background p-8 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-4 mt-4">
                    <h2 className="text-3xl font-bold text-primary-text">Create Posts</h2>
                    <div className="flex justify-start md:justify-end mt-2 md:mt-0">
                        <Link href={'/dashboard/posts/'} className="bg-primary-btn hover:bg-secondary-btn px-4 py-2 rounded-3xl transition cursor-pointer">
                            <i className="fa-solid fa-arrow-left text-primary-text font-bold"></i>
                        </Link>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={submit}>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-secondary-text mb-1">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
                        />
                        {errors.title &&
                            <div className="alert text-red-500 text-xs mt-2">
                                {errors.title}
                            </div>
                        }
                    </div>

                    <div>
                        <label htmlFor="post_type" className="block text-sm font-medium text-secondary-text mb-1">Post Type</label>
                        <select
                            id="post_type"
                            name="post_type"
                            value={data.post_type}
                            onChange={e => setData('post_type', e.target.value)}
                            className="w-full px-4 py-2 border border-secondary-text rounded-lg bg-secondary-background transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
                        >
                            <option value="">Select Post Type</option>
                            {post_types.map((item, i) => (
                                <option value={item.id} key={i}>{item.name}</option>
                            ))}
                        </select>
                        {errors.post_type &&
                            <div className="alert text-red-500 text-xs mt-2">
                                {errors.post_type}
                            </div>
                        }
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-secondary-text mb-1">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={data.category}
                            onChange={e => setData('category', e.target.value)}
                            className="w-full px-4 py-2 border border-secondary-text rounded-lg bg-secondary-background transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
                        >
                            <option value="">Select Category</option>
                            {categories.map((item, i) => (
                                <option value={item.id} key={i}>{item.name}</option>
                            ))}
                        </select>
                        {errors.category &&
                            <div className="alert text-red-500 text-xs mt-2">
                                {errors.category}
                            </div>
                        }
                    </div>

                    <div>
                        <label htmlFor="thumbnail" className="block text-sm font-medium text-secondary-text mb-1">Thumbbail</label>
                        <div className="grid justify-end mb-2">
                            {selectedImage ? (
                            <img src={selectedImage} alt="Image" className="w-20" />
                            ) : (
                            <img src="/storage/Images/Blank/blank.jpg" alt="Blank IMG" className="w-20 rounded-lg" />
                            )}
                        </div>
                        <input
                            type="file"
                            id="thumbnail"
                            name="thumbnail"
                            onChange={handleImageChange}
                            className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
                        />
                        {errors.thumbnail &&
                            <div className="alert text-red-500 text-xs mt-2">
                                {errors.thumbnail}
                            </div>
                        }
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-secondary-text mb-1">Content</label>
                        <div className="rounded-lg bg-white">
                            <TipTapEditor
                                value={data.content}
                                onChange={handleEditorChange}
                                onImageUploadSuccess={handleImageUploadSuccess}
                                onImageUploadError={handleImageUploadError}
                                onImageAddedToContent={handleImageAddedToContent} 
                            />
                        </div>
                        {errors.content &&
                            <div className="alert text-red-500 text-xs mt-2">
                                {errors.content}
                            </div>
                        }
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-secondary-text mb-1">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={data.status}
                            onChange={e => setData('status', e.target.value)}
                            className="w-full px-4 py-2 border border-secondary-text rounded-lg bg-secondary-background transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
                        >
                            <option value="">Select Status</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                        {errors.status &&
                            <div className="alert text-red-500 text-xs mt-2">
                                {errors.status}
                            </div>
                        }
                    </div>

                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-secondary-text mb-1">Tags</label>
                        <TagInput
                            value={localTags}
                            onChange={handleTagInputChange} 
                            suggestions={tagSuggestions}
                        />

                        {errors.tags &&
                            <div className="alert text-red-500 text-xs mt-2">
                            {errors.tags}
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