<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\UserModel;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Session;

class GoogleAuthController extends Controller
{
    public function google_redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function google_callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = UserModel::where('google_id', $googleUser->getId())->first();

            if (!$user) {
                $user = UserModel::where('email', $googleUser->getEmail())->first();

                $fullName = $googleUser->getName();
                $nameParts = explode(' ', $fullName);
                $firstName = $nameParts[0] ?? ''; 

                if ($user) {
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'avatar' =>  $googleUser->getAvatar()
                    ]);
                } else {
                   $user = UserModel::create([
                        'name' => $googleUser->getName(),
                        'username' => $this->generateUniqueUsername($googleUser->getName()),
                        'email' => $googleUser->getEmail(),
                        'role' => 'reader',
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                        'password' => null,
                    ]);
                }
            }

            Auth::login($user);

            return redirect()->route('home.index')->with('success', 'Berhasil Login!');

        } catch (\Exception $e) {
            dd($e);
            return redirect('/login')->with('error', 'Gagal login dengan Google.');
        }
    }

    private function generateUniqueUsername($name)
    {
        // Ambil hanya nama depan (sebelum spasi)
        $firstWord = explode(' ', trim($name))[0];

        // Bersihkan: hanya huruf, angka, titik, dan underscore
        $base = strtolower(preg_replace('/[^a-zA-Z0-9._]/', '', $firstWord));

        // Potong max 15 karakter
        $base = substr($base, 0, 15);

        $username = $base;
        $i = 1;

        // Cek dan pastikan unik, tambah angka jika sudah dipakai
        while (UserModel::where('username', $username)->exists()) {
            $random = (string)rand(100, 99999);
            $username = substr($base, 0, 20 - strlen($random)) . $random;

            if ($i++ > 10) break;
        }

        return $username;
    }



}