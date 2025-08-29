<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FileManagerController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ImageUploadController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Contact route
Route::get('/lien-he', [ContactController::class, 'index'])->name('contact.index');

// Posts routes
Route::get('/tin-tuc', [PostController::class, 'index'])->name('posts.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Image upload route for editor
    Route::post('/upload-image', [ImageUploadController::class, 'upload'])->name('upload.image');
    
    // File manager routes
    Route::get('/file-manager', [FileManagerController::class, 'index'])->name('file-manager.index');
    Route::post('/file-manager/upload', [FileManagerController::class, 'upload'])->name('file-manager.upload');
    Route::delete('/file-manager/delete', [FileManagerController::class, 'delete'])->name('file-manager.delete');
    Route::post('/file-manager/folder', [FileManagerController::class, 'createFolder'])->name('file-manager.create-folder');
    Route::put('/file-manager/rename', [FileManagerController::class, 'rename'])->name('file-manager.rename');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
require __DIR__.'/auth.php';

// Single post/category route - CategoryController will handle both
Route::get('/{slug}', [CategoryController::class, 'show'])
    ->where('slug', '^[a-z0-9-]+$')
    ->name('posts.show');
