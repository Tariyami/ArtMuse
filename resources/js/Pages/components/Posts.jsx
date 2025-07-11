import { Bookmark, Grid, Heart, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
const Posts = () => {
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [savedPosts, setSavedPosts] = useState(new Set());
    const handleLike = (postId) => {
        setLikedPosts((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    };
    const posts = [
        {
            id: 1,
            user: { name: "Luna Rose", avatar: "🌸", verified: true },
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
            caption: "Dreamy sunset painting with soft pastels 🌅✨",
            likes: 324,
            comments: 28,
            time: "2h ago",
            isAI: false,
        },
        {
            id: 2,
            user: { name: "Aria Dreams", avatar: "🦋", verified: false },
            image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
            caption: "AI-generated fairy garden concept 🧚‍♀️🌺",
            likes: 156,
            comments: 12,
            time: "4h ago",
            isAI: true,
        },
        {
            id: 3,
            user: { name: "Soft Aesthetic", avatar: "🌙", verified: true },
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
            caption: "Minimalist bedroom art piece 🤍",
            likes: 892,
            comments: 67,
            time: "6h ago",
            isAI: false,
        },
    ];
    return (
        <div>
            {posts.map((post) => (
                <div
                    className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-pink-100 overflow-hidden mb-6 hover:shadow-xl transition-all duration-300"
                    key={post.id}
                >
                    <div className="p-4 border-b border-pink-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full flex items-center justify-center text-white font-semibold">
                                    {post.user.avatar}
                                </div>
                                <div>
                                    <div className="flex items-center space-x-1">
                                        <span className="font-semibold text-pink-800">
                                            {post.user.name}
                                        </span>
                                        {post.user.verified && (
                                            <span className="text-pink-400">
                                                ✓
                                            </span>
                                        )}
                                        {post.isAI && (
                                            <span className="bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                                                AI
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm text-pink-500">
                                        {post.time}
                                    </span>
                                </div>
                            </div>
                            <button className="text-pink-400 hover:text-pink-600">
                                <Grid className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="aspect-square bg-gradient-to-br from-pink-50 to-purple-50">
                        <img
                            src={post.image}
                            alt="Art post"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => handleLike(post.id)}
                                    className={`flex items-center space-x-1 transition-colors ${
                                        likedPosts.has(post.id)
                                            ? "text-pink-500"
                                            : "text-pink-400 hover:text-pink-500"
                                    }`}
                                >
                                    <Heart
                                        className={`h-6 w-6 ${
                                            likedPosts.has(post.id)
                                                ? "fill-current"
                                                : ""
                                        }`}
                                    />
                                    <span className="text-sm font-medium">
                                        {post.likes}
                                    </span>
                                </button>
                                <button className="flex items-center space-x-1 text-pink-400 hover:text-pink-500">
                                    <MessageCircle className="h-6 w-6" />
                                    <span className="text-sm font-medium">
                                        {post.comments}
                                    </span>
                                </button>
                                <button className="text-pink-400 hover:text-pink-500">
                                    <Share2 className="h-6 w-6" />
                                </button>
                            </div>
                            <button
                                onClick={() => handleSave(post.id)}
                                className={`transition-colors ${
                                    savedPosts.has(post.id)
                                        ? "text-pink-500"
                                        : "text-pink-400 hover:text-pink-500"
                                }`}
                            >
                                <Bookmark
                                    className={`h-6 w-6 ${
                                        savedPosts.has(post.id)
                                            ? "fill-current"
                                            : ""
                                    }`}
                                />
                            </button>
                        </div>

                        <p className="text-pink-800 text-sm leading-relaxed">
                            {post.caption}
                        </p>

                        <div className="mt-3 pt-3 border-t border-pink-100">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full"></div>
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    className="flex-1 text-sm text-pink-700 placeholder-pink-400 bg-transparent focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Posts;
