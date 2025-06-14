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

class AdminSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $SEO = SEOModel::all();
        $settings = [
            'seo' => $SEO
        ];
        $data = [
            'settings' => $settings
        ];
        // dd($data);

        return Inertia::render('Admin/Settings/Index', $data);
    }

    public function seo_update(Request $request, $id)
    {
        $seo = SEOModel::findOrFail($id);

        $request->validate([
            'brand_name' => 'required|string|max:255',
            'brand_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp', 
            'favicon' => 'nullable|image|mimes:jpeg,png,ico', 
            'main_url' => 'required|url',
            'description' => 'nullable|string',
        ]);

        $brandLogoName = $seo->brand_logo;
        $faviconName = $seo->favicon;

        if ($request->hasFile('brand_logo')) {
            if ($brandLogoName && Storage::disk('public')->exists('Images/BrandLogo/' . $brandLogoName)) {
                Storage::disk('public')->delete('Images/BrandLogo/' . $brandLogoName);
            }

            $brandLogo = $request->file('brand_logo');
            $brandLogoName = 'brand_logo-' . Str::uuid() . '.' . $brandLogo->getClientOriginalExtension();
            $brandLogo->storeAs('Images/BrandLogo', $brandLogoName, 'public');
        }

        if ($request->hasFile('favicon')) {
            if ($faviconName && Storage::disk('public')->exists('Images/Favicon/' . $faviconName)) {
                Storage::disk('public')->delete('Images/Favicon/' . $faviconName);
            }

            $favicon = $request->file('favicon');
            $faviconName = 'favicon-' . Str::uuid() . '.' . $favicon->getClientOriginalExtension();
            $favicon->storeAs('Images/Favicon/', $faviconName, 'public');
        }

        $seo->update([
            'brand_name' => $request->input('brand_name'),
            'brand_logo' => $brandLogoName,
            'favicon' => $faviconName,
            'main_url' => $request->input('main_url'),
            'description' => $request->input('description'),
        ]);

        return redirect()->back()->with('success', 'SEO updated successfully.!');
    }

}