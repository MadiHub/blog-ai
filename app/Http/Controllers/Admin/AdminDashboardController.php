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

class AdminDashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $SEO = SEOModel::first();
        $data = [
            'seo' => $SEO,
        ];

        return Inertia::render('Admin/Dashboard/Index', $data);
    }

}