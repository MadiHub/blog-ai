<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use DOMDocument; // Penting: Import DOMDocument untuk parsing HTML

use App\Models\SEOModel;
use App\Models\PostModel;
use App\Models\PostImageModel;
use App\Models\PostTypeModel;
use App\Models\CategoryModel;
use App\Models\TagModel;
use App\Models\PostTagModel;
use App\Models\CommentModel; // Penting: Import CommentModel jika digunakan untuk menghapus komentar

class AdminPostController extends Controller
{
    public function index()
    {
        $SEO = SEOModel::first();
        $posts = PostModel::with('category', 'post_type')->orderBy('updated_at', 'desc')->get();
        $postTypes = PostTypeModel::orderBy('position', 'asc')->get(['name', 'slug']);
        $data = [
            'seo' => $SEO,
            'posts' => $posts,
            'postTypes' => $postTypes,
        ];

        return Inertia::render('Admin/ManagePosts/Index', $data);
    }

    public function create()
    {
        $SEO = SEOModel::first();
        $post_types = PostTypeModel::all();
        $categories = CategoryModel::all();
        $tags = TagModel::all();

        $data = [
            'seo' => $SEO,
            'post_types' => $post_types,
            'categories' => $categories,
            'tags' => $tags,
        ];

        return Inertia::render('Admin/ManagePosts/Create', $data);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'post_type' => 'required',
            'category' => 'required',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'content' => 'required|string',
            'status' => 'required|in:published,draft',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255',
        ]);

        DB::beginTransaction();

        try {
            $slug = Str::slug($request->title);
            $originalSlug = $slug;
            $counter = 1;

            while (PostModel::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            $thumbnailName = null;
            if ($request->hasFile('thumbnail')) {
                $thumbnail = $request->file('thumbnail');
                $thumbnailName = 'thumbnail-' . Str::uuid() . '.' . $thumbnail->getClientOriginalExtension();
                $thumbnail->storeAs('Images/Posts/Thumbnails/', $thumbnailName, 'public');
            }

            $post = PostModel::create([
                'user_id' => 1,
                'title' => $request->title,
                'post_type_id' => $request->post_type,
                'category_id' => $request->category,
                'slug' => $slug,
                'thumbnail' => $thumbnailName,
                'content' => $request->content,
                'status' => $request->status,
                'published_at' => $request->status === 'published' ? now() : null,
            ]);

            $contentImagesFilenames = [];
            if (!empty($request->input('content'))) {
                $dom = new DOMDocument();
                libxml_use_internal_errors(true);
                $dom->loadHTML($request->input('content'));
                libxml_clear_errors();

                $images = $dom->getElementsByTagName('img');
                foreach ($images as $img) {
                    $src = $img->getAttribute('src');
                    if (Str::startsWith($src, '/storage/Images/Posts/Content/')) {
                         $contentImagesFilenames[] = basename($src);
                    }
                }
            }
            
            foreach ($contentImagesFilenames as $filename) {
                PostImageModel::create([
                    'post_id' => $post->id,
                    'filename' => $filename,
                ]);
            }

            $tagIds = [];
            if ($request->has('tags') && is_array($request->input('tags'))) {
                foreach ($request->input('tags') as $tagName) {
                    $tag = TagModel::firstOrCreate(
                        ['name' => $tagName],
                        ['slug' => Str::slug($tagName)]
                    );
                    $tagIds[] = $tag->id;
                }
            }
            $post->tags()->sync($tagIds);

            DB::commit();

            return redirect()->route('dashboard.posts.index')->with('success', 'Data created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error creating post with tags: ' . $e->getMessage());
            return back()->with('error', 'Failed to create data: ' . $e->getMessage());
        }
    }
    
    public function show(string $slug)
    {
        $SEO = SEOModel::first();
        $post = PostModel::where('slug', $slug)->with(['images', 'tags'])->firstOrFail();
        $post_types = PostTypeModel::all();
        $categories = CategoryModel::all();
        $tags = TagModel::all(); 

        $data = [
            'seo' => $SEO,
            'post' => $post,            
            'post_types' => $post_types,
            'categories' => $categories,
            'tags' => $tags
        ];

        return Inertia::render('Admin/ManagePosts/Show', $data);
    }

    public function edit(string $slug)
    {
        $SEO = SEOModel::first();
        $post = PostModel::where('slug', $slug)->with(['images', 'tags'])->firstOrFail();
        $post_types = PostTypeModel::all();
        $categories = CategoryModel::all();
        $tags = TagModel::all(); 

        $data = [
            'seo' => $SEO,
            'post' => $post,
            'post_types' => $post_types,
            'categories' => $categories,
            'tags' => $tags
        ];

        return Inertia::render('Admin/ManagePosts/Edit', $data);
    }

    public function update(Request $request, PostModel $post)
    {
        $rules = [
            'title' => 'required|string|max:255',
            'post_type' => 'required',
            'category' => 'required',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'content' => 'required|string',
            'status' => 'required|in:published,draft',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255',
        ];

        $request->validate($rules);

        DB::beginTransaction();

        try {
            $newSlug = Str::slug($request->title);
            $originalNewSlug = $newSlug;
            $counter = 1;

            while (PostModel::where('slug', $newSlug)->where('id', '!=', $post->id)->exists()) {
                $newSlug = $originalNewSlug . '-' . $counter;
                $counter++;
            }

            $thumbnailName = $post->thumbnail;

            if ($request->hasFile('thumbnail')) {
                if ($post->thumbnail && Storage::disk('public')->exists('Images/Posts/Thumbnails/' . $post->thumbnail)) {
                    Storage::disk('public')->delete('Images/Posts/Thumbnails/' . $post->thumbnail);
                }
                $thumbnail = $request->file('thumbnail');
                $thumbnailName = 'thumbnail-' . Str::uuid() . '.' . $thumbnail->getClientOriginalExtension();
                $thumbnail->storeAs('Images/Posts/Thumbnails/', $thumbnailName, 'public');
            } elseif ($request->boolean('clear_thumbnail')) {
                if ($post->thumbnail && Storage::disk('public')->exists('Images/Posts/Thumbnails/' . $post->thumbnail)) {
                    Storage::disk('public')->delete('Images/Posts/Thumbnails/' . $post->thumbnail);
                }
                $thumbnailName = null;
            }

            $post->update([
                'user_id' => 1,
                'title' => $request->title,
                'post_type_id' => $request->post_type,
                'category_id' => $request->category,
                'slug' => $newSlug,
                'thumbnail' => $thumbnailName,
                'content' => $request->content,
                'status' => $request->status,
                'published_at' => $request->status === 'published' && !$post->published_at ? now() : $post->published_at,
            ]);

            $currentImageFilenames = $post->images->pluck('filename')->toArray();

            $newImageFilenamesFromContent = [];
            if (!empty($request->input('content'))) {
                $dom = new DOMDocument();
                libxml_use_internal_errors(true);
                $dom->loadHTML($request->input('content'));
                libxml_clear_errors();

                $images = $dom->getElementsByTagName('img');
                foreach ($images as $img) {
                    $src = $img->getAttribute('src');
                    if (Str::startsWith($src, '/storage/Images/Posts/Content/')) {
                        $newImageFilenamesFromContent[] = basename($src);
                    }
                }
            }

            $imagesToDelete = array_diff($currentImageFilenames, $newImageFilenamesFromContent);
            foreach ($imagesToDelete as $filename) {
                PostImageModel::where('post_id', $post->id)->where('filename', $filename)->delete();
                if (Storage::disk('public')->exists('Images/Posts/Content/' . $filename)) {
                    Storage::disk('public')->delete('Images/Posts/Content/' . $filename);
                }
            }

            $imagesToAdd = array_diff($newImageFilenamesFromContent, $currentImageFilenames);
            foreach ($imagesToAdd as $filename) {
                PostImageModel::create([
                    'post_id' => $post->id,
                    'filename' => $filename,
                ]);
            }

            $tagIds = [];
            if ($request->has('tags') && is_array($request->input('tags'))) {
                foreach ($request->input('tags') as $tagName) {
                    $tag = TagModel::firstOrCreate(
                        ['name' => $tagName],
                        ['slug' => Str::slug($tagName)]
                    );
                    $tagIds[] = $tag->id;
                }
            }
            $post->tags()->sync($tagIds);

            DB::commit();

            return redirect()->route('dashboard.posts.index')->with('success', 'Post updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error updating post: ' . $e->getMessage());
            return back()->with('error', 'Failed to update post: ' . $e->getMessage());
        }
    }

    public function destroy(string $id)
    {
        $post = PostModel::where('id', $id)->with('images', 'comments')->first(); // Load 'comments' relasi

        if (!$post) {
            return redirect()->back()->with('error', 'Postingan tidak ditemukan.');
        }

        // Hapus SEMUA komentar yang terkait dengan postingan ini terlebih dahulu
        // Ini mengatasi error foreign key constraint violation
        $post->comments()->delete(); 

        // --- Proses Penghapusan Gambar Konten ---
        foreach ($post->images as $image) {
            $filePath = 'Images/Posts/Content/' . $image->filename;

            if (Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
        }
        PostImageModel::where('post_id', $post->id)->delete();

        // --- Proses Penghapusan Thumbnail (jika ada) ---
        if ($post->thumbnail) {
            $thumbnailPath = 'Images/Posts/Thumbnails/' . $post->thumbnail;
            if (Storage::disk('public')->exists($thumbnailPath)) {
                Storage::disk('public')->delete($thumbnailPath);
            }
        }

        // --- Proses Penghapusan Relasi Tags (jika ada) ---
        $post->tags()->sync([]);

        // --- Proses Penghapusan Postingan Utama ---
        $post->delete();

        return redirect()->back()->with('success', 'Postingan berhasil dihapus.');
    }

    public function upload_image_content(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $fileName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $destinationPath = 'Images/Posts/Content';

            try {
                $image->storeAs($destinationPath, $fileName, 'public');
                $publicUrl = Storage::url($destinationPath . '/' . $fileName);

                return response()->json([
                    'url' => $publicUrl,
                    'filename' => $fileName,
                ]);
            } catch (\Exception $e) {
                return response()->json(['message' => 'Failed to upload image.', 'error' => $e->getMessage()], 500);
            }
        }

        return response()->json(['message' => 'No image file uploaded.'], 400);
    }
    
    public function destroy_image_content($filename)
    {
        $imagePathOnDisk = 'Images/Posts/Content/' . $filename;

        if (Storage::disk('public')->exists($imagePathOnDisk)) {
            try {
                Storage::disk('public')->delete($imagePathOnDisk);
                PostImageModel::where('filename', $filename)->delete();

                return response()->json(['success' => true, 'message' => 'Image deleted successfully.'], 200);
            } catch (\Exception $e) {
                return response()->json(['success' => false, 'message' => 'Failed to delete image on server: ' . $e->getMessage()], 500);
            }
        }

        return response()->json(['success' => false, 'message' => 'Image file not found on server or already deleted.'], 404);
    }
}
