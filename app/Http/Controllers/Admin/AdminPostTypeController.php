<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Carbon\Carbon; 

// MODEL
use App\Models\SEOModel;
use App\Models\PostTypeModel;

class AdminPostTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $SEO = SEOModel::first();
        $post_types = PostTypeModel::orderBy('position', 'asc')->get(); 
        
        $data = [
            'seo' => $SEO,
            'post_types' => $post_types,
        ];

        return Inertia::render('Admin/ManagePostTypes/Index', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $SEO = SEOModel::first();
        $data = [
            'seo' => $SEO,
        ];
        return Inertia::render('Admin/ManagePostTypes/Create', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'name' => 'required|string|max:50|unique:tb_post_type,name',
            'description' => 'required|string',
            'icon' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp',
        ]);

        if ($request->hasFile('icon')) {
            $image = $request->file('icon');
            $imageName = 'post-type-' . Str::uuid() . '.' . $image->getClientOriginalExtension();

            $image->storeAs('Images/PostTypes', $imageName, 'public');
        } 

        PostTypeModel::create([
            'name' => $request->input('name'),
            'slug' => str::slug($request->input('name')),
            'description' => $request->input('description'),
            'icon' => $imageName,
            'position' => 0,
        ]);

        return redirect()->route('dashboard.post.types.index')->with('success', 'Data created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $SEO = SEOModel::first();
        $post_type = PostTypeModel::where('slug', $slug)->firstOrFail();

        $data = [
            'seo' => $SEO,
            'post_type' => $post_type
        ];

        return Inertia::render('Admin/ManagePostTypes/Show', $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $slug)
    {
        $SEO = SEOModel::first();
        $post_type = PostTypeModel::where('slug', $slug)->firstOrFail();

        $data = [
            'seo' => $SEO,
            'post_type' => $post_type
        ];

        return Inertia::render('Admin/ManagePostTypes/Edit', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $post_type = PostTypeModel::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:50|unique:tb_post_type,name,' . $post_type->id,
            'description' => 'required|string',
            'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp',
        ]);

        $imageName = $post_type->icon;

        if ($request->hasFile('icon')) {
            if ($imageName && \Storage::disk('public')->exists('Images/PostTypes/' . $imageName)) {
                \Storage::disk('public')->delete('Images/PostTypes/' . $imageName);
            }

            // Upload gambar baru
            $image = $request->file('icon');
            $imageName = 'post-type-' . Str::uuid() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('Images/PostTypes', $imageName, 'public');
        }

        $post_type->update([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'slug' => Str::slug($request->input('name')),
            'icon' => $imageName,
        ]);

        return redirect()->route('dashboard.post.types.index')->with('success', 'Data updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $postType = PostTypeModel::find($id); 

        if (!$postType) {
            return redirect()->back()->with('error', 'Post Type not found.');
        }

        if ($postType->icon) {
            $iconPath = 'Images/PostTypes/' . $postType->icon;
            if (Storage::disk('public')->exists($iconPath)) {
                Storage::disk('public')->delete($iconPath);
            }
        }

        $postType->delete();

        return redirect()->route('dashboard.post.types.index')->with('success', 'Post Type deleted successfully.');
    }

   
    public function update_post_types_position(Request $request) {
        $data = $request->input('data_sortable_post_types');
        foreach ($data as $item) {
            $currentUpdatedAt = PostTypeModel::where('id', $item['id'])->value('updated_at');

            PostTypeModel::where('id', $item['id']) 
                ->update(['position' => $item['position'], 'updated_at' => $currentUpdatedAt]);
        }

        return response()->json(['message' => 'Positions updated successfully'], 200);
    }
}
