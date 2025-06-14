import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from '@inertiajs/react';
import React, { useEffect, useRef } from 'react';
import { addCopyButtonsToCodeBlocks } from '@/Components/previewCodeBlockEnhancements';

export default function ManagePostsShow({ post, post_types, categories, seo }) {
    const { data } = useForm({
        title: post.title,
        post_type: post.post_type_id,
        category: post.category_id,
        thumbnail: post.thumbnail,
        content: post.content,
        status: post.status,
        tags: post.tags.map(tag => tag.name),
    });

    const previewRef = useRef(null);

    useEffect(() => {
        if (previewRef.current && data.content) {
            const timer = setTimeout(() => {
                addCopyButtonsToCodeBlocks(previewRef.current);
            }, 2);
            return () => clearTimeout(timer);
        }
    }, [data.content]);

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Unknown';
    };

    const getPostTypeName = (postTypeId) => {
        const post_type = post_types.find(ptype => ptype.id === postTypeId);
        return post_type ? post_type.name : 'Unknown';
    };

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
            <div className="max-w-6xl mx-auto bg-secondary-background p-8 rounded-lg shadow-lg space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-4 mt-4">
                    <h2 className="text-3xl font-bold text-white">Detail Post</h2>
                    <div className="flex justify-start md:justify-end mt-2 md:mt-0">
                        <Link href={'/dashboard/posts/'} className="bg-primary-btn hover:bg-secondary-btn px-4 py-2 rounded-3xl transition cursor-pointer">
                            <i className="fa-solid fa-arrow-left text-primary-text font-bold"></i>
                        </Link>
                    </div>
                </div>

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-secondary-text mb-1">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={data.title}
                        disabled
                        className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text bg-gray-700 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label htmlFor="post_type" className="block text-sm font-medium text-secondary-text mb-1">Post Type</label>
                    <input
                        type="text"
                        id="post_type"
                        name="post_type"
                        value={getPostTypeName(data.post_type)}
                        disabled
                        className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text bg-gray-700 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-secondary-text mb-1">Category</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={getCategoryName(data.category)}
                        disabled
                        className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text bg-gray-700 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label htmlFor="thumbnail" className="block text-sm font-medium text-secondary-text mb-1">Thumbnail</label>
                    <div className="mb-2">
                        {post.thumbnail && (
                            <img
                                src={`/storage/Images/Posts/Thumbnails/${post.thumbnail}`}
                                alt={post.slug}
                                className="w-20 rounded-lg object-cover"
                            />
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-secondary-text mb-1">Content</label>
                    <div className="rounded-lg bg-white">
                        <div
                            ref={previewRef}
                            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none p-4 border border-gray-300 rounded-lg mt-4"
                            dangerouslySetInnerHTML={{ __html: data.content }}
                        ></div>
                    </div>
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-secondary-text mb-1">Status</label>
                    <input
                        type="text"
                        id="status"
                        name="status"
                        value={data.status === 'draft' ? 'Draft' : 'Published'}
                        disabled
                        className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text bg-gray-700 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-secondary-text mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2 p-2 border border-secondary-text rounded-lg bg-gray-700 cursor-not-allowed">
                        {data.tags.length > 0 ? (
                            data.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-primary-btn text-primary-text px-3 py-1 rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                            ))
                        ) : (
                            <span className="text-secondary-text text-sm italic">No tags</span>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
        </>
    );
}