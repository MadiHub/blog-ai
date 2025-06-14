<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Home\CommentController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminPostController;
use App\Http\Controllers\Admin\AdminPostTypeController;
use App\Http\Controllers\Admin\AdminSettingController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Auth\AuthController;

Route::get('/', [HomeController::class, 'index'])->name('home.index');
Route::get('/post/category/{id}', [HomeController::class, 'post_by_category'])->name('home.post.category');
Route::get('/post/tag/{id}', [HomeController::class, 'post_by_tag'])->name('home.post.tag');
Route::get('/post/type/{id}', [HomeController::class, 'post_by_type'])->name('home.post.type');
Route::get('/post/{id}', [HomeController::class, 'post_detail'])->name('home.post');

Route::post('/post/comments', [CommentController::class, 'comment_store']);
Route::delete('/post/comments/{comment}', [CommentController::class, 'comment_destroy']);


// AUTH
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('/login/process', [AuthController::class, 'login_process'])->name('auth.login_process');
    Route::get('/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/register/step', [AuthController::class, 'register_step'])->name('auth.register_step');

    Route::get('google/redirect', [GoogleAuthController::class, 'google_redirect'])->name('google.redirect');    
    Route::get('auth/google/callback', [GoogleAuthController::class, 'google_callback'])->name('google.callback');
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// DASHBOARD
Route::prefix('dashboard')
    ->name('dashboard.')
    ->group(function () {

        Route::middleware(['admin'])->group(function () {
            Route::get('/users/generate', [AdminUserController::class, 'generateUniqueUser'])->name('users.generate');
            Route::resource('users', AdminUserController::class)->names('users');
            Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings');
            Route::put('/settings/seo/{id}', [AdminSettingController::class, 'seo_update'])->name('settings.seo');
        });

        Route::middleware(['admin_or_author'])->group(function () {
            Route::get('/', [AdminDashboardController::class, 'index'])->name('index'); 
            Route::resource('categories', AdminCategoryController::class)->names('categories');
            Route::resource('posts', AdminPostController::class)->names('posts');
            Route::post('/posts/upload-image-content', [AdminPostController::class, 'upload_image_content'])->name('posts.upload_image_content');
            Route::delete('/posts/image-content-delete/{filename}', [AdminPostController::class, 'destroy_image_content'])->name('post.image_content_delete');
            Route::resource('post/types', AdminPostTypeController::class)->names('post.types');
        });
    });


