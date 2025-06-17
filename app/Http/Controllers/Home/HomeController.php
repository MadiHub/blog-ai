<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use HTMLPurifier;
use HTMLPurifier_Config;

// MODEL
use App\Models\UserModel;
use App\Models\SEOModel;
use App\Models\PostModel;
use App\Models\CategoryModel;
use App\Models\TagModel;
use App\Models\PostTypeModel;
use App\Models\CommentModel;

class HomeController extends Controller
{
    public function index()
    {
        $SEO = SEOModel::first();
        $categories = CategoryModel::get();

        $postTypes = PostTypeModel::with(['posts' => function ($query) {
                $query->with('category')
                    ->whereNotNull('published_at')
                    ->latest()
                    ->limit(3);
            }])
            ->orderBy('position', 'asc')
            ->get()
            ->map(function ($postType) {
                $postType->posts = $postType->posts->map(function ($post) {
                    // Tidak disanitasi: kirim konten asli langsung
                    $post->content = $post->content;
                    return $post;
                });
                return $postType;
            });

        return Inertia::render('Home/Index', [
            'seo' => $SEO,
            'categories' => $categories,
            'post_types' => $postTypes,
        ]);
    }

    public function post_by_category($slug)
    {
        $SEO = SEOModel::first();
        $category = CategoryModel::where('slug', $slug)->firstOrFail();

        $config = HTMLPurifier_Config::createDefault();
        $config->set('HTML.Allowed', 'p,a[href],strong,em,ul,ol,li,img[src|alt|title|width|height|class],h1,h2,h3,blockquote,br,code,pre');
        $purifier = new HTMLPurifier($config);

        $posts = PostModel::with('category')
            ->whereHas('category', function ($query) use ($slug) {
                $query->where('slug', $slug); 
            })
            ->orderBy('updated_at', 'desc')
            ->whereNotNull('published_at')
            ->get()
            ->map(function ($post) use ($purifier) {
                $post->content = $purifier->purify($post->content);
                return $post;
            });
        
        $postTypes = PostTypeModel::get();

        $data = [
            'seo' => $SEO,
            'category' => $category,
            'posts' => $posts,
            'post_types' => $postTypes,
        ];

        return Inertia::render('Home/PostByCategory', $data);
    }

    public function post_by_tag($slug)
    {
        $SEO = SEOModel::first();
        $tag = TagModel::where('slug', $slug)->firstOrFail();
        // $config = HTMLPurifier_Config::createDefault();
        // $config->set('HTML.Allowed', 'p,a[href],strong,em,ul,ol,li,img[src|alt|title|width|height|class],h1,h2,h3,blockquote,br,code,pre');
        // $purifier = new HTMLPurifier($config);

        $posts = PostModel::with('tags', 'category') 
            ->whereHas('tags', function ($query) use ($slug) {
                $query->where('slug', $slug);
            })
            ->orderBy('updated_at', 'desc')
            ->whereNotNull('published_at') 
            ->get()
            ->map(function ($post) use ($purifier) {
                $post->content = $purifier->purify($post->content);
                return $post;
            });

        $postTypes = PostTypeModel::get();

        $data = [
            'seo' => $SEO,
            'tag' => $tag,
            'posts' => $posts,
            'post_types' => $postTypes,
        ];
        return Inertia::render('Home/PostByTag', $data);
    }

    public function post_detail($slug)
    {
        $SEO = SEOModel::first();
        $post = PostModel::with(['category', 'author', 'tags'])
                         ->where('slug', $slug)
                         ->whereNotNull('published_at')
                         ->firstOrFail();

        // $config = HTMLPurifier_Config::createDefault();
        // $config->set('HTML.Allowed', 'p,a[href],strong,em,ul,ol,li,img[src|alt|title|width|height|class],h1,h2,h3,blockquote,br,code,pre');
        // $purifier = new HTMLPurifier($config);

        // $post->content = $purifier->purify($post->content);

        $postTagIds = $post->tags->pluck('id');

        $relatedPostsQuery = PostModel::with('category')
            ->whereNotNull('published_at')
            ->where(function ($query) use ($post, $postTagIds) {
                $query->where('id', '!=', $post->id) // ini akan berlaku ke semuanya di dalam
                    ->where(function ($q) use ($post, $postTagIds) {
                        $q->where('category_id', $post->category_id);

                        if ($postTagIds->isNotEmpty()) {
                            $q->orWhereHas('tags', function ($tagQuery) use ($postTagIds) {
                                $tagQuery->whereIn('tb_tags.id', $postTagIds);
                            });
                        }
                    });
            });


        $relatedPosts = $relatedPostsQuery->inRandomOrder()
                                          ->limit(3)
                                          ->get();

        // dd($relatedPosts);

        $postTypes = PostTypeModel::get();

        $comments = $post->comments()
                         ->with(['userComment', 'replies.userComment']) 
                         ->whereNull('parent_id') 
                         ->orderBy('created_at', 'desc')
                         ->get();

                        //  dd($comments);

        return Inertia::render('Home/PostDetail', [
            'seo' => $SEO,
            'post' => $post,
            'relatedPosts' => $relatedPosts,
            'post_types' => $postTypes,
            'comments' => $comments,
        ]);
    }

    public function post_by_type($postType)
    {
        $SEO = SEOModel::first();
        $postType = PostTypeModel::where('slug', $postType)->firstOrFail(); 

        $posts = $postType->posts()
                         ->with('category')
                         ->whereNotNull('published_at')
                         ->orderBy('updated_at', 'desc')
                         ->get();

        $postTypes = PostTypeModel::get();

        $data = [
            'seo' => $SEO,
            'postType' => $postType,
            'posts' => $posts,
            'post_types' => $postTypes,
        ];

        return Inertia::render('Home/PostByType', $data);
    }
}