import React, { useEffect } from "react";
import HomeLayout from '@/Layouts/HomeLayout';
import { Head, Link } from '@inertiajs/react';

export default function PostsByCategory({ post_types, category, posts, seo }) {
    const truncateText = (htmlString, maxLength) => {
        const div = document.createElement('div');
        div.innerHTML = htmlString;
        const plainText = div.textContent || div.innerText || '';
        if (plainText.length > maxLength) {
            return plainText.substring(0, maxLength) + '..Baca selengkapnya';
        }
        return plainText;
    }

    useEffect(() => {
        AOS.init({ once: true });
    }, []);
    return (
        <>
            <Head>
                <link rel="icon" href={`/storage/Images/Favicon/${seo.favicon}`} type="image/x-icon" />
                <meta itemprop="name" content={seo.brand_name} />
                <meta name="description" content={seo.description} />
                <meta itemprop="image" content={`/storage/Images/BrandLogo/${seo.brand_logo}`} />
                <title>{`Post Category - ${category.name}`}</title>
            </Head>
            <HomeLayout post_types={post_types} seo={seo}>
               <section className="relative w-full min-h-[50vh] flex items-center overflow-hidden bg-secondary-background">
                    <div className="absolute bottom-0 left-0 w-full h-8 bg-primary-background rounded-t-3xl z-[1]"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
                        <div className="text-center">
                            <h1 className="title text-3xl sm:text-4xl md:text-5xl font-bold text-primary-text leading-tight">
                                Kategori: {category.name} 📚
                            </h1>
                            <p className="sub-title shadow mt-4 text-base md:text-lg text-secondary-text bg-secondary-background rounded-md px-4 py-3 border-l-4 border-secondary-btn inline-block">
                                Jelajahi semua postingan dalam kategori {category.name}.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-4 mt-17 mb-20">
                    <h2 className="text-2xl font-bold text-primary-text mb-6">Daftar Postingan</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <Link 
                                data-aos="fade-up"
                                data-aos-delay="100"
                                data-aos-duration="500"
                                href={`/post/${post.slug}`} key={post.id} className="block group bg-secondary-background p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-300 hover:no-underline">
                                    <div className="aspect-video bg-white rounded-xl overflow-hidden mb-4">
                                        <img
                                            src={`/storage/Images/Posts/Thumbnails/${post.thumbnail}`}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                    </div>
                                    <span className="top-3 left-3 bg-primary-btn text-primary-text text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-md">
                                        {post.category.name}
                                    </span>
                                    <h3 className="text-lg font-semibold text-primary-text mb-2 group-hover:text-primary-btn transition duration-300">{post.title}</h3>
                                    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none rounded-lg mt-4 text-secondary-text"
                                        >
                                        <p>{truncateText(post.content, 70)}</p> 
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-secondary-text text-lg col-span-full text-center">
                                Belum ada postingan dalam kategori ini.
                            </p>
                        )}
                    </div>
                </section>
            </HomeLayout>
        </>
    );
}