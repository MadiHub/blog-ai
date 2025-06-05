<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Auth\AuthController;

Route::get('/', [GuestController::class, 'index'])->name('guest.home');
Route::get('/register', [AuthController::class, 'register'])->name('auth.register');
Route::post('/register/step', [AuthController::class, 'register_step'])->name('auth.register_step');
Route::get('/login', [AuthController::class, 'login'])->name('auth.login');

// admin
Route::prefix('admin')
    ->name('admin.')
    // ->middleware(['auth', 'isAdmin'])
    ->group(function () {
        Route::resource('users', AdminUserController::class)->names('users');
        Route::resource('blogs', AdminBlogController::class)->names('blogs');
    });

