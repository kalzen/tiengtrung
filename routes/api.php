<?php

use App\Http\Controllers\Api\PingController;
use App\Http\Controllers\Api\PostController;
use Illuminate\Support\Facades\Route;

Route::middleware(['verify.api.token', 'throttle:60,1'])->group(function () {
    Route::get('/ping', PingController::class);

    Route::get('/posts/categories', [PostController::class, 'categories']);
    Route::post('/posts', [PostController::class, 'store']);
});
