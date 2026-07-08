<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyApiToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = config('aimarketing.api_token');

        if (empty($token)) {
            return response()->json([
                'message' => 'API token chưa được cấu hình trên server',
            ], 503);
        }

        $authHeader = $request->bearerToken();

        if (! $authHeader || ! hash_equals($token, $authHeader)) {
            return response()->json([
                'message' => 'Token không hợp lệ',
            ], 401);
        }

        return $next($request);
    }
}
