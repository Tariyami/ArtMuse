<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GeneralController extends Controller
{
    //
public function renderLogin()
{
    return inertia('Login');
}

public function renderRegister()
{
    return inertia('Register');
}

public function renderFeed()
{
    return inertia('Feed');
}

public function renderProfile()
{
    return inertia('Profile');
}

public function render()
{
    return inertia('Feed');
}
public function viewProfile()
{
    return inertia('Profile');
}
}
