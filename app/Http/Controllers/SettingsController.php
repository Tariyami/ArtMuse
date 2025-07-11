<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Display the settings page.
     */
    public function index()
    {
        return Inertia::render('Settings', [
            'auth' => [
                'user' => \Illuminate\Support\Facades\Auth::user(),
            ],
        ]);
        
    }
    /**
     * Update the user's profile information.
     */
    public function update(Request $request)
    {
        // Check if user is authenticated
        if (!\Illuminate\Support\Facades\Auth::check()) {
            return redirect()->route('login')->with('error', 'Please login to access settings.');
        }

        $user = \Illuminate\Support\Facades\Auth::user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'current_password' => ['nullable', 'required_with:password'],
            'password' => ['nullable', 'confirmed', Password::defaults()],
        ]);

        // Verify current password if new password is provided
        if ($request->filled('password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return back()->withErrors(['current_password' => 'The current password is incorrect.']);
            }
        }

        // Update name and email
        $user->name = $validated['name'];
        $user->email = $validated['email'];

        // Update password if provided
        if ($request->filled('password')) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return back()->with('success', 'Settings updated successfully!');
    }
}