<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

// MODEL
use App\Models\CategoryModel;

class AdminCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = CategoryModel::all();
        $data = [
            'categories' => $categories
        ];

        return Inertia::render('Admin/ManageCategories/Index', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/ManageCategories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:tb_categories,name',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp',
        ]);

       if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = 'category-' . Str::uuid() . '.' . $image->getClientOriginalExtension();

            $image->storeAs('Images/Categories', $imageName, 'public');
        } 

        CategoryModel::create([
            'name' => $request->input('name'),
            'slug' => str::slug($request->input('name')),
            'image' => $imageName,
        ]);

        return redirect()->route('dashboard.categories.index')->with('success', 'Data created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $category = CategoryModel::where('slug', $slug)->firstOrFail();

        $data = [
            'category' => $category
        ];

        return Inertia::render('Admin/ManageCategories/Show', $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $slug)
    {
        $category = CategoryModel::where('slug', $slug)->firstOrFail();

        $data = [
            'category' => $category
        ];

        return Inertia::render('Admin/ManageCategories/Edit', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $category = CategoryModel::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:tb_categories,name,' . $category->id,
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp',
        ]);

        $imageName = $category->image;

        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($imageName && \Storage::disk('public')->exists('Images/Categories/' . $imageName)) {
                \Storage::disk('public')->delete('Images/Categories/' . $imageName);
            }

            // Upload gambar baru
            $image = $request->file('image');
            $imageName = 'category-' . Str::uuid() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('Images/Categories', $imageName, 'public');
        }

        $category->update([
            'name' => $request->input('name'),
            'slug' => Str::slug($request->input('name')),
            'image' => $imageName,
        ]);

        return redirect()->route('dashboard.categories.index')->with('success', 'Data updated successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = CategoryModel::findOrFail($id);

        if ($category->image && \Storage::disk('public')->exists('Images/Categories/' . $category->image)) {
            \Storage::disk('public')->delete('Images/Categories/' . $category->image);
        }

        $category->delete();

        return back()->with(['success' => 'Data deleted successfully.']);
    }


    public function generateUniqueUser()
    {
        do {
            $randomName = 'UserDemo' . rand(1000, 9999);
            $randomUsername = strtolower($randomName . rand(10, 99));
            $randomEmail = strtolower($randomName) . rand(10, 99) . '@example.com';

            $existsUsername = UserModel::where('username', $randomUsername)->exists();
            $existsEmail = UserModel::where('email', $randomEmail)->exists();

        } while ($existsUsername || $existsEmail);

        return response()->json([
            'name' => $randomName,
            'username' => $randomUsername,
            'email' => $randomEmail,
        ]);
    }

}
