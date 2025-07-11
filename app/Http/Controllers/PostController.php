<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function create_post(Request $request)
    {
        // Validate the request
        $request->validate([
            'image' => 'required|image|max:2048', // max 2MB
            'caption' => 'nullable|string|max:1000',
        ]);

        // Store the uploaded image in the 'posts' folder inside 'storage/app/public'
        $imagePath = $request->file('image')->store('posts', 'public');

        // Create the post
        $post = Post::create([
            'user_id' => $request->user()->id,
            'image_path' => $imagePath,
            'caption' => $request->caption,
        ]);

        // Return a success response
        return response()->json([
            'message' => 'Post created successfully',
            'post' => $post
        ], 201);
    }
}
