<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Carbon;

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

    public function delete_post($id)
    {
        // Find the post by ID
        $post = Post::findOrFail($id);

        // Check if the authenticated user is the owner of the post
        if ($post->user_id !== Auth()->user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete the image file from storage
        Storage::disk('public')->delete($post->image_path);

        // Delete the post from the database
        $post->delete();

        // Return a success response
        return response()->json(['message' => 'Post deleted successfully'], 200);
    }

    public function like_post($id)
    {
        try {
            // Find the post by ID
            $post = Post::findOrFail($id);
            // Check if the authenticated user has already liked the post
            if ($post->likes()->where('user_id', auth()->id())->exists()) {
                // Unlike the post
                $post->likes()->where('user_id', auth()->id())->delete();
                return response()->json(['message' => 'Post unliked successfully'], 200);
            } else {
                // Like the post
                $post->likes()->create(['user_id' => auth()->id()]);
                return response()->json(['message' => 'Post liked successfully'], 200);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred', 'error' => $e->getMessage()], 500);
        }
    }

    public function view_all_posts()
    {
        // Fetch posts with user relationship and comments count only
        $posts = Post::with('user')
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'user' => [
                        'name' => $post->user->name,
                        'avatar' => $post->user->avatar ?? '🌸', // fallback emoji if no avatar
                        'verified' => (bool) $post->user->is_verified, // assuming you have a boolean column
                    ],
                    'image' => $post->image_path, // make sure this is the full image URL
                    'has_liked' => $post->likes()->where('user_id', auth()->id())->exists(),
                    'caption' => $post->caption,
                    'likes' => $post->likes->count() ?? 0, // make sure you have likes_count in DB
                    'comments' => $post->comments_count ?? 0,
                    'commentsActual' => $post->comments->load('user') ?? 0, // only comment count, no actual comments data
                    'time' => Carbon::parse($post->created_at)->diffForHumans(),
                    'isAI' => (bool) $post->is_ai, // assuming you store this in DB
                ];
            });
    
        return response()->json([
            'posts' => $posts
        ], 200);
    }

    public function leaveComments(Request $request, $postId)
    {
        try {
            // Validate the request
            $request->validate([
                'content' => 'required|string|max:500',
            ]);

            // Check if the post exists
            $post = Post::findOrFail($postId);

            // Create the comment
            $comment = Comment::create([
                'user_id' => auth()->id(),
                'post_id' => $postId,
                'content' => $request->content,
            ]);

            // Load the comment with user relationship
            $comment->load('user');

            // Format the comment response
            $commentData = [
                'id' => $comment->id,
                'content' => $comment->content,
                'user' => [
                    'name' => $comment->user->name,
                    'avatar' => $comment->user->avatar ?? '🌸',
                ],
                'time' => Carbon::parse($comment->created_at)->diffForHumans(),
            ];

            return response()->json([
                'message' => 'Comment added successfully',
                'comment' => $commentData
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while adding comment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getComments($postId)
    {
        try {
            // Get comments for a specific post
            $comments = Comment::where('post_id', $postId)
                ->with('user')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($comment) {
                    return [
                        'id' => $comment->id,
                        'content' => $comment->content,
                        'user' => [
                            'name' => $comment->user->name,
                            'avatar' => $comment->user->avatar ?? '🌸',
                        ],
                        'time' => Carbon::parse($comment->created_at)->diffForHumans(),
                    ];
                });

            return response()->json([
                'comments' => $comments
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while fetching comments',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}