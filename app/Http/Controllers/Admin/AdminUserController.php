<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

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
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-zA-Z\s\'.-]+$/'
            ],
            'username' => [
                'required',
                'string',
                'max:20',
                'unique:tb_users,username',
                'regex:/^[a-zA-Z0-9._]+$/'
            ],
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
                'name' => [
                    'required',
                    'string',
                    'max:100',
                    'regex:/^[a-zA-Z\s\'.-]+$/'
                ],
                'username' => [
                'required',
                'string',
                'max:20',
                'regex:/^[a-zA-Z0-9._]+$/',
                Rule::unique('tb_users')->ignore($id)
            ],
            'email' => ['required', 'email', Rule::unique('tb_users')->ignore($id)],
            'role' => ['required', 'string', Rule::in(['admin', 'author', 'reader'])],
        ]);

        $user = UserModel::findOrFail($id);

        $oldEmail = $user->email;
        $newEmail = $request->input('email');

        // Reset google_id & avatar jika email diubah dan akun ini sebelumnya Google login
        if (!empty($user->google_id) && $oldEmail !== $newEmail) {
            $user->google_id = null;
            $user->avatar = null;
        }

        $user->update([
            'name' => $request->input('name'),
            'username' => $request->input('username'),
            'email' => $newEmail,
            'role' => $request->input('role'),
        ]);


        return redirect()->route('dashboard.users.index')->with('success', 'Data updated successfully.');
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
        $firstNames = [
            // Jawa
            'Agung', 'Rini', 'Slamet', 'Wulan', 'Eko', 'Dwi', 'Siti', 'Yuni', 'Joko', 'Ratna',

            // Jakarta
            'Fajar', 'Indah', 'Tasya', 'Adit', 'Nabila', 'Rangga', 'Vina', 'Dani', 'Ayu', 'Bayu',

            // Kalimantan
            'Dian', 'Ardi', 'Mega', 'Rizky', 'Nova', 'Yudi', 'Santi', 'Rendy', 'Linda', 'Tomi',

            // Tambahan nasional
            'Farhan', 'Nina', 'Rafa', 'Zahra', 'Iqbal', 'Melati', 'Irwan', 'Kiki', 'Rika', 'Yoga'
        ];

        $lastNames = [
            // Umum di Jawa
            'Sutrisno', 'Handayani', 'Wahyudi', 'Widodo', 'Nurhadi', 'Suryani', 'Hartono', 'Kusuma',

            // Jakarta / Betawi
            'Hidayat', 'Saputro', 'Syahputra', 'Rahmawati', 'Herlambang', 'Fadillah',

            // Kalimantan & umum
            'Anshari', 'Mahendra', 'Iskandar', 'Putra', 'Permata', 'Utari', 'Ramadhani', 'Setiawan',

            // Nasional
            'Wijaya', 'Pratama', 'Utami', 'Maulana', 'Cahyani', 'Fitriani', 'Nugroho', 'Purnama'
        ];


        do {
            $randomName = $firstNames[array_rand($firstNames)] . ' ' . $lastNames[array_rand($lastNames)];

            // Gunakan nama depan (tanpa spasi) untuk username base
            $usernameBase = strtolower(preg_replace('/[^a-zA-Z0-9._]/', '', explode(' ', $randomName)[0]));
            $suffix = rand(10, 99);

            $maxLength = 20 - strlen($suffix);
            $usernameBase = substr($usernameBase, 0, $maxLength);

            $randomUsername = $usernameBase . $suffix;
            $randomEmail = $usernameBase . rand(10, 99) . '@example.com';

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
