<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

// MODEL
use App\Models\SEOModel;
use App\Models\PostModel;
use App\Models\CategoryModel;
use App\Models\UserModel;

class AdminDashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $SEO = SEOModel::first();

        $totalPosts = PostModel::count();

        $totalCategories = CategoryModel::count();

        $totalReaders = UserModel::where('role', 'reader')->count();

        $data = [
            'seo' => $SEO,
            'totalPosts' => $totalPosts,
            'totalCategories' => $totalCategories,
            'totalReaders' => $totalReaders,
        ];

        return Inertia::render('Admin/Dashboard/Index', $data);
    }

}