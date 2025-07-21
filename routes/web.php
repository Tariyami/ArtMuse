<?php

use App\Http\Controllers\GeneralController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/login',[GeneralController::class,'renderLogin'])->name('login');

Route::get('/register',[GeneralController::class,'renderRegister']);

Route::get('/feed',[GeneralController::class,'renderFeed']);

Route::get('/profile',[GeneralController::class,'renderProfile']);

Route::get('/',[GeneralController::class,'render']);

Route::get('/profile',[GeneralController::class,'viewProfile']);

Route::get('/Settings', [SettingsController::class, 'index']);


