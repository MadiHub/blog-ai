import React, { useState, useEffect, useRef } from 'react';
import HomeLayout from '@/Layouts/HomeLayout';
import { Head, Link, router } from '@inertiajs/react';
import { addCopyButtonsToCodeBlocks } from '@/Components/previewCodeBlockEnhancements';
import Swal from 'sweetalert2';

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

export default function PostDetail({ auth, post, relatedPosts, seo, post_types, comments: initialComments }) {
    const previewRef = useRef(null);

    const [comments, setComments] = useState(initialComments);
    const [commentContent, setCommentContent] = useState('');
    const [replyToCommentId, setReplyToCommentId] = useState(null);
    const [replyToUsername, setReplyToUsername] = useState('');
    const commentTextareaRef = useRef(null);

    useEffect(() => {
        if (previewRef.current && post.content) {
            const timer = setTimeout(() => {
                addCopyButtonsToCodeBlocks(previewRef.current);
            }, 2);
            return () => clearTimeout(timer);
        }
    }, [post.content]);

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
        if (typeof AOS !== 'undefined') {
            AOS.init({ once: true });
        }
    }, []);

    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!auth?.user) {
            Swal.fire({
            icon: 'warning',
            title: 'Oops!',
            text: 'Anda harus login untuk bisa berkomentar.',
            });
            return;
        }

        if (!commentContent.trim()) {
            Swal.fire({
            icon: 'warning',
            title: 'Komentar kosong!',
            text: 'Komentar tidak boleh kosong!',
            });
            return;
        }

        try {
            const response = await fetch('/post/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
            body: JSON.stringify({
                post_id: post.id,
                comment: commentContent,
                parent_id: replyToCommentId,
            }),
            });

            if (response.ok) {
            const newComment = await response.json();

            setComments(prevComments => {
                if (replyToCommentId) {
                return prevComments.map(comment =>
                    comment.id === replyToCommentId
                    ? { ...comment, replies: [...(comment.replies || []), newComment] }
                    : comment
                );
                } else {
                return [...prevComments, newComment];
                }
            });

            setCommentContent('');
            setReplyToCommentId(null);
            setReplyToUsername('');

            Swal.fire({
                icon: 'success',
                title: 'Komentar berhasil dikirim!',
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false,
            });

            } else {
            const errorData = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Gagal mengirim komentar',
                text: errorData.message || 'Terjadi kesalahan.',
            });
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
            Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'Terjadi kesalahan saat mengirim komentar.',
            });
        }
        };


    const handleReplyClick = (commentId, username) => {
        setReplyToCommentId(commentId);
        setReplyToUsername(username);

        // Scroll ke form
        document.getElementById('commentFormSection')?.scrollIntoView({ behavior: 'smooth' });

        // Tunggu scroll selesai dulu baru fokus (pakai timeout kecil)
        setTimeout(() => {
            commentTextareaRef.current?.focus();
        }, 300); // 300ms cukup smooth
    };


    const handleCancelReply = () => {
        setReplyToCommentId(null);
        setReplyToUsername('');
    };

   const handleDeleteComment = async (commentId) => {
  if (!auth?.user) {
    Swal.fire({
      icon: 'warning',
      title: 'Login diperlukan',
      text: 'Anda harus login untuk menghapus komentar.',
    });
    return;
  }

  const result = await Swal.fire({
    title: 'Yakin ingin menghapus komentar ini?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6b7280', // Tailwind gray-500
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal'
  });

  if (!result.isConfirmed) return;

  try {
    const response = await fetch(`/post/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Komentar berhasil dihapus!',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
      });

      setComments(prevComments => {
        const updatedComments = prevComments.filter(comment => comment.id !== commentId);
        return updatedComments.map(comment => ({
          ...comment,
          replies: comment.replies?.filter(reply => reply.id !== commentId) || []
        }));
      });

    } else if (response.status === 403) {
      Swal.fire({
        icon: 'error',
        title: 'Akses ditolak',
        text: 'Anda tidak memiliki izin untuk menghapus komentar ini.',
      });
    } else if (response.status === 404) {
      Swal.fire({
        icon: 'error',
        title: 'Komentar tidak ditemukan',
        text: 'Komentar sudah dihapus atau tidak tersedia.',
      });
    } else {
      const errorData = await response.json();
      Swal.fire({
        icon: 'error',
        title: 'Gagal menghapus komentar',
        text: errorData.message || 'Terjadi kesalahan.',
      });
    }

  } catch (error) {
    console.error('Error deleting comment:', error);
    Swal.fire({
      icon: 'error',
      title: 'Oops!',
      text: 'Terjadi kesalahan saat menghapus komentar.',
    });
  }
};


    return (
        <>
            <Head>
                <link rel="icon" href={`/storage/Images/Favicon/${seo.favicon}`} type="image/x-icon" />
                <meta itemProp="name" content={seo.brand_name} />
                <meta name="description" content={seo.description} />
                <meta itemProp="image" content={`/storage/Images/BrandLogo/${seo.brand_logo}`} />
                <title>{post.title}</title>
            </Head>
            <HomeLayout auth={auth} post_types={post_types} seo={seo}>
                <section className="relative w-full min-h-[40vh] flex items-center justify-center bg-secondary-background overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-full h-8 bg-primary-background rounded-t-3xl z-[1]"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 text-center">
                        <span className="inline-block bg-primary-btn text-primary-text text-sm font-semibold px-4 py-1.5 rounded-full shadow-md mb-4">
                            {post.category.name}
                        </span>
                        <h1 className="title text-sm md:text-md lg:text-xl font-bold text-primary-text leading-tight mb-4">
                            {post.title}
                        </h1>
                        <p className="text-secondary-text text-base text-sm">
                            Oleh <span className="font-semibold">{post.author.username}</span> pada {formatDate(post.created_at)}
                        </p>
                    </div>
                </section>

                <section
                    data-aos="fade-zoom"
                    data-aos-delay="100"
                    data-aos-duration="500"
                    className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                    <div className="rounded-lg shadow overflow-hidden bg-secondary-background">
                        {post.tags && post.tags.length > 0 && (
                            <div className="p-6 pb-0 md:p-8 md:pb-0 lg:p-10 lg:pb-0">
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map(tag => (
                                        <a
                                            key={tag.id}
                                            href={`/post/tag/${tag.slug}`}
                                            className="inline-block bg-orange-600 text-primary-text text-xs font-semibold px-3 py-1 rounded-full shadow-sm hover:bg-accent-tag-hover transition-colors duration-200"
                                        >
                                            #{tag.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="p-6 md:p-8 lg:p-10">
                            <div className="rounded-lg">
                                <div
                                    ref={previewRef}
                                    className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-primary-text"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                    <div className="bg-secondary-background rounded-lg shadow p-6 md:p-8 lg:p-10">
                        <h2 className="text-2xl font-bold text-primary-text mb-6">Diskusi & Komentar</h2>

                        <div id="commentFormSection" className="mb-8">
                            <h3 className="text-xl font-semibold text-primary-text mb-4">Tinggalkan Komentar</h3>
                            {auth?.user ? (
                                <form onSubmit={handleSubmitComment}>
                                    {replyToCommentId && (
                                        <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-between">
                                            <p className="text-blue-800 dark:text-blue-200 text-sm">
                                                Membalas kepada: <span className="font-bold">{replyToUsername}</span>
                                            </p>
                                            <button
                                                type="button"
                                                onClick={handleCancelReply}
                                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium focus:outline-none"
                                            >
                                                Batalkan
                                            </button>
                                        </div>
                                    )}
                                    <div className="mb-4">
                                        <label htmlFor="commenterName" className="block text-primary-text text-sm font-medium mb-2">Nama Anda</label>
                                        <input
                                            type="text"
                                            id="commenterName"
                                            name="commenterName"
                                            value={auth.user.username}
                                            readOnly
                                            className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 focus:outline-none cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="commentContent" className="block text-primary-text text-sm font-medium mb-2">Komentar Anda</label>
                                       <textarea
                                            ref={commentTextareaRef}
                                            id="commentContent"
                                            name="commentContent"
                                            rows="5"
                                            className="w-full px-4 py-2 rounded-lg border bg-transparent text-secondary-text focus:outline-none focus:ring-1 focus:ring-primary-btn"
                                            placeholder={replyToCommentId ? `Tulis balasan Anda untuk ${replyToUsername}...` : "Tulis komentar Anda di sini..."}
                                            value={commentContent}
                                            onChange={(e) => setCommentContent(e.target.value)}
                                        ></textarea>

                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-secondary-btn hover:bg-primary-btn text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                                    >
                                        {replyToCommentId ? 'Kirim Balasan' : 'Kirim Komentar'}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center bg-primary-background p-6 rounded-lg">
                                    <p className="text-primary-text text-lg mb-4">
                                        Anda harus login untuk bisa berkomentar. Yuk, login dulu!
                                    </p>
                                    <Link
                                        href="/login"
                                        className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md shadow-lg transition-colors duration-200 transform hover:scale-105"
                                    >
                                        Login Sekarang
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-primary-text mb-4">Komentar Lainnya</h3>
                            {comments && comments.length > 0 ? (
                                <div className="space-y-6 max-h-96 overflow-y-scroll pr-2 custom-scroll">
                                    {comments.map(comment => (
                                        <div key={comment.id} className="bg-primary-background p-4 rounded-lg shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    {comment.user_comment?.avatar ? (
                                                        <img
                                                            src={comment.user_comment.avatar}
                                                            alt={comment.user_comment.username || "Pengguna Anonim"}
                                                            className="w-10 h-10 rounded-full mr-3 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-secondary-btn rounded-full flex items-center justify-center text-primary-text font-extrabold text-lg mr-3">
                                                            {comment.user_comment?.username ? comment.user_comment.username.charAt(0).toUpperCase() : '?' }
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-primary-text">
                                                            {comment.user_comment?.username || "Pengguna Tidak Dikenal"}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {comment.created_at ? new Date(comment.created_at).toLocaleString('id-ID', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            }) : 'Waktu tidak tersedia'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {auth?.user && auth.user.id === comment.user_id && (
                                                    <button
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="text-red-500 hover:text-red-700 text-sm font-medium focus:outline-none"
                                                        title="Hapus komentar ini"
                                                    >
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-primary-text break-words">
                                                {comment.comment || 'Komentar tidak tersedia.'} {/* Ubah dari comment menjadi content */}
                                            </p>

                                                {/* Kondisi untuk menyembunyikan tombol "Balas" jika itu adalah komentar milik user yang sedang login */}
                                            {auth?.user && auth.user.id !== comment.user_id && (
                                                <button
                                                    onClick={() => handleReplyClick(comment.id, comment.user_comment?.username || "Pengguna Ini")}
                                                    className="mt-2 text-blue-500 hover:text-blue-700 text-sm font-medium focus:outline-none"
                                                >
                                                    Balas
                                                </button>
                                            )}

                                            {comment.replies && comment.replies.length > 0 && (
                                                <div className="ml-12 mt-4 space-y-4 border-l-2 border-gray-300 dark:border-gray-700 pl-4">
                                                    {comment.replies.map(reply => (
                                                        <div key={reply.id} className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center">
                                                                    {reply.user_comment?.avatar ? (
                                                                        <img
                                                                            src={reply.user_comment.avatar}
                                                                            alt={reply.user_comment.username || "Pengguna Anonim"}
                                                                            className="w-8 h-8 rounded-full mr-3 object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-8 h-8 bg-secondary-btn rounded-full flex items-center justify-center text-primary-text font-extrabold text-sm mr-3">
                                                                            {reply.user_comment?.username ? reply.user_comment.username.charAt(0).toUpperCase() : '?' }
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <p className="font-semibold text-primary-text text-sm">
                                                                            {reply.user_comment?.username || "Pengguna Tidak Dikenal"}
                                                                        </p>
                                                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                            {reply.created_at ? new Date(reply.created_at).toLocaleString('id-ID', {
                                                                                year: 'numeric',
                                                                                month: 'short',
                                                                                day: 'numeric',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                            }) : 'Waktu tidak tersedia'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                {auth?.user && auth.user.id === reply.user_id && (
                                                                    <button
                                                                        onClick={() => handleDeleteComment(reply.id)}
                                                                        className="text-red-500 hover:text-red-700 text-xs font-medium focus:outline-none"
                                                                        title="Hapus balasan ini"
                                                                    >
                                                                        Hapus
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <p className="text-primary-text text-sm break-words">
                                                                {reply.comment || 'Balasan tidak tersedia.'} {/* Ubah dari comment menjadi content */}
                                                            </p>
                                                            {auth?.user && auth.user.id !== reply.user_id && (
                                                                <button
                                                                    onClick={() => handleReplyClick(reply.id, reply.user_comment?.username || "Pengguna Ini")}
                                                                    className="mt-2 text-blue-500 hover:text-blue-700 text-xs font-medium focus:outline-none"
                                                                >
                                                                    Balas
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-primary-text text-center py-4">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
                            )}
                        </div>
                    </div>
                </section>

                {relatedPosts && relatedPosts.length > 0 && (
                    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mb-20">
                        <h2 className="text-2xl font-bold text-primary-text mb-6 text-center">
                            Konten Terkait Lainnya
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost) => (
                                <Link
                                data-aos="fade-up"
                                data-aos-delay="100"
                                data-aos-duration="500"
                                href={`/post/${relatedPost.slug}`} key={relatedPost.id} className="block group bg-secondary-background p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-300 hover:no-underline">
                                    <div className="aspect-video bg-white rounded-xl overflow-hidden mb-4">
                                        <img
                                            src={`/storage/Images/Posts/Thumbnails/${relatedPost.thumbnail}`}
                                            alt={relatedPost.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                    </div>
                                    {relatedPost.category && (
                                        <span className="top-3 left-3 bg-primary-btn text-primary-text text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-md">
                                            {relatedPost.category.name}
                                        </span>
                                    )}
                                    <h3 className="text-lg font-semibold text-primary-text mb-2 group-hover:text-primary-btn transition duration-300">{relatedPost.title}</h3>
                                    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none rounded-lg mt-4 text-secondary-text"
                                    >
                                        <p>{truncateText(relatedPost.comment, 70)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </HomeLayout>
        </>
    );
}