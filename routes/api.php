<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SettingsController;

Route::get('/user', function (Request $request) {
  return $request->user()->load('posts', 'likes');
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::get('/', [AuthController::class, 'dashboard'])
    ->middleware('auth:sanctum');

Route::post('/create/post', [PostController::class, 'create_post'])
    ->middleware('auth:sanctum');

Route::get('/view/posts', [PostController::class, 'view_all_posts'])
    ->middleware('auth:sanctum');
    
Route::delete('/delete/post/{id}', [PostController::class, 'delete_post'])  
    ->middleware('auth:sanctum')
    ->name('post.delete');

Route::post('/like/post/{id}', [PostController::class, 'like_post'])
    ->middleware('auth:sanctum')
    ->name('post.like');
    
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/Settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::put('/update', [SettingsController::class, 'update'])->name('settings.update');

    Route::delete('/delete', [SettingsController::class,'destroy'])->name(name: 'settings.delete');
});

// Add these routes to your existing routes/api.php file

// Comment routes
Route::middleware('auth:sanctum')->group(function () {
  // Add comment to a post
  Route::post('/posts/{postId}/comments', [PostController::class, 'leaveComments']);
  
  // Get comments for a specific post
  Route::get('/posts/{postId}/comments', [PostController::class, 'getComments']);
});