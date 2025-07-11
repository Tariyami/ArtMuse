<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SettingsController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::get('/', [AuthController::class, 'dashboard'])
    ->middleware('auth:sanctum');

Route::post('/create/post', [PostController::class, 'create_post'])
    ->middleware('auth:sanctum');
    
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/Settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::put('/Settings', [SettingsController::class, 'update'])->name('settings.update');
});