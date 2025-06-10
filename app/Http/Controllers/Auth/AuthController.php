<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

// MODEL
use App\Models\UserModel;

class AuthController extends Controller
{
    public function register() {
        // dd($request->all());
        $step = Session::get('register_step', 1);
        $data = [
            'step' => $step,
            'errors' => Session::get('errors') ? Session::get('errors')->getBag('default')->getMessages() : new \stdClass(),
        ];
        return Inertia::render('Auth/Register', $data);
    }

    public function register_step(Request $request)
    {
        $step = $request->input('step', 1);

        $rules = [];
        if ($step == 1) {
            $rules = [
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:tb_users,username',
            ];
        } elseif ($step == 2) {
            $rules = [
                'email' => 'required|email|unique:tb_users,email',
            ];
        } elseif ($step == 3) {
            $rules = [
                'password' => 'required|string|confirmed',
            ];
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        if ($step < 3) {
            return back()->with([
                'success' => "Step $step passed",
            ]);
        } else {
            UserModel::create([
                'name' => $request->input('name'),
                'username' => $request->input('username'),
                'email' => $request->input('email'),
                'role' => 'reader',
                'password' => Hash::make($request->input('password')),
            ]);
            return redirect()->route('auth.login')->with('success', 'Registration complete!');
        }
    }

    public function login() {
        return Inertia::render('Auth/Login');
    }

    public function login_process(Request $request)
    {
        $request->validate([
            'email_or_username' => 'required|string',
            'password' => 'required|string',
        ], [
            'email_or_username.required' => 'Email atau Username wajib diisi.',
            'password.required' => 'Password wajib diisi.',
        ]);

        $loginField = $request->input('email_or_username');
        $password = $request->input('password');

        $fieldType = filter_var($loginField, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $credentials = [
            $fieldType => $loginField,
            'password' => $password,
        ];

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->intended('/');
        }

        return back()->withErrors([
            'email_or_username' => 'Kredensial salah atau tidak ditemukan.',
        ])->withInput($request->only('email_or_username'));
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken(); 

        return Inertia::render('Auth/Login');
    }
}
