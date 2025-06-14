<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

// MODEL
use App\Models\SEOModel;
use App\Models\UserModel;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $SEO = SEOModel::first();
        $users = UserModel::orderByRaw("FIELD(role, 'admin', 'author', 'reader')")
            ->orderBy('updated_at', 'desc')
            ->get();
        $data = [
            'seo' => $SEO,
            'users' => $users
        ];
        return Inertia::render('Admin/ManageUsers/Index', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $SEO = SEOModel::first();
        $data = [
            'seo' => $SEO
        ];
        return Inertia::render('Admin/ManageUsers/Create', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:tb_users,username',
            'email' => 'required|email|unique:tb_users,email',
            'role' => 'required|string|in:admin,author,reader',
            'password' => 'required|string',
        ]);

        UserModel::create([
            'name' => $request->input('name'),
            'username' => $request->input('username'),
            'email' => $request->input('email'),
            'role' => $request->input('role'),
            'password' => Hash::make($request->input('password')),
        ]);

        return redirect()->route('dashboard.users.index')->with('success', 'Data created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $SEO = SEOModel::first();
        $user = UserModel::where('email', $id)->firstOrFail();

        $data = [
            'seo' => $SEO,
            'user' => $user
        ];

        return Inertia::render('Admin/ManageUsers/Show', $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $SEO = SEOModel::first();
        $user = UserModel::where('email', $id)->firstOrFail();

        $data = [
            'seo' => $SEO,
            'user' => $user
        ];

        return Inertia::render('Admin/ManageUsers/Edit', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:tb_users,username,' . $id,  
            'email' => 'required|email|unique:tb_users,email,' . $id,                 
            'role' => 'required|string|in:admin,author,reader',
        ]);

        $user = UserModel::findOrFail($id);

        $user->update([
            'name' => $request->input('name'),
            'username' => $request->input('username'),
            'email' => $request->input('email'),
            'role' => $request->input('role'),
        ]);

        return back()->with(['success' => 'Data updated successfully.']);
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = UserModel::findOrFail($id);  

        $user->delete();

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
