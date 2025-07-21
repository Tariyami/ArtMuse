<?php

namespace App\Http\Controllers;

use Carbon\Exceptions\Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
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
    try {
        // Check if user is authenticated
        if (!Auth::check()) {
          return response()->json(['message' => 'Unauthenticated'], 403);
        }

        $user = request()->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'current_password' => ['nullable', 'required_with:password'],
            'password' => ['nullable', 'confirmed', Password::defaults()],
        ]);

        // Verify current password if new password is provided
        if ($request->filled('password')) {
            if (!Hash::check($request->current_password, $user->password)) {
              return response()->json(['message' => 'The password was incorrect.'], 401);
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

        return response()->json(['message' => 'Profile updated successfully.'], 200);
    } catch (Exception $e) {
        // Log the actual error for debugging
        Log::error('Settings update error: '.$e->getMessage());

        // Return with a user-friendly error
        return back()->with('error', 'Something went wrong while updating your settings. Please try again.');
    }
}
    public function destroy(Request $request)
    {
      $user = $request->user(); // Authenticated user

      $user->delete();

      return response()->json(['message' => 'Account deleted successfully'], 200);
  }
}