<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
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
        // dd($request->all());
        dd('hai');
        return Inertia::render('Auth/Login');
    }
}
