<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth; 

class AdminOrAuthorMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            abort(404);
        }

        $user = Auth::user();
        
        $allowedRoles = ['admin', 'author']; 

        if (!in_array($user->role, $allowedRoles)) {
            abort(404);
        }

        return $next($request);
    }
}
