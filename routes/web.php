<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminPostController;
use App\Http\Controllers\Auth\AuthController;

Route::get('/', [HomeController::class, 'index'])->name('home.index');

// AUTH
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('/login/process', [AuthController::class, 'login_process'])->name('auth.login_process');
    Route::get('/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/register/step', [AuthController::class, 'register_step'])->name('auth.register_step');
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// DASHBOARD 
Route::middleware(['admin'])->prefix('dashboard')
    ->name('dashboard.')
    ->group(function () {
        Route::get('/users/generate', [AdminUserController::class, 'generateUniqueUser'])->name('users.generate');
        Route::resource('users', AdminUserController::class)->names('users');
        Route::resource('categories', AdminCategoryController::class)->names('categories');
        Route::resource('posts', AdminPostController::class)->names('posts');
        Route::post('/posts/upload-image-content', [AdminPostController::class, 'upload_image_content'])->name('posts.upload_image_content');
        Route::delete('/posts/image-content-delete/{filename}', [AdminPostController::class, 'destroy_image_content'])->name('post.image_content_delete');
        Route::resource('blogs', AdminBlogController::class)->names('blogs');
    });
    // Route::post('/image-upload', [AdminPostController::class, 'upload']);
    // Route::delete('/image-delete/{filename}', [AdminPostController::class, 'destroyPostImage'])->name('image.posts.destroy');


