import { router } from "@inertiajs/react";
import { Bookmark, Heart, MessageCircle, Share, X } from "lucide-react";
import { useEffect, useState } from "react";
import MuseLayout from "../Layouts/MuseLayout";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const token = localStorage.getItem("token");
    const [selectedPost, setSelectedPost] = useState(null); // holds the post data
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const handlePostClick = (post) => {
        setSelectedPost(post);
        setIsPostModalOpen(true);
        setShowComments(false);
        setIsLiked(false);
        setLikeCount(post.likes || 0);
    };

    const handleClosePostModal = () => {
        setIsPostModalOpen(false);
        setSelectedPost(null);
        setShowComments(false);
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    };

    const handleCommentClick = () => {
        setShowComments(!showComments);
    };

    useEffect(() => {
        if (!token) {
            router.visit("/unauthorized");
            return;
        }
        const fetchUser = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    setName(userData.name || "");
                    setEmail(userData.email || "");
                } else {
                    router.visit("/unauthorized");
                }
            } catch (error) {
                router.visit("/unauthorized");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    console.log("User data fetched:", user);

    return (
        <MuseLayout>
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center mb-8">
                    <div className="w-32 h-32 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                        {user ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <h1 className="text-2xl font-bold text-pink-800 mb-2">
                        {user ? user.name : "Loading..."}
                    </h1>
                    <p className="text-pink-600 max-w-md mx-auto">
                        Creating dreamy art pieces and AI-generated masterpieces
                        ✨
                    </p>

                    <div className="flex justify-center space-x-8 mt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-pink-800">
                                {user?.posts.length || 0}
                            </div>
                            <div className="text-sm text-pink-600">Posts</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {user?.posts?.map((post, i) => (
                        <div
                            key={post.id || i}
                            onClick={() => handlePostClick(post)}
                            className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl overflow-hidden cursor-pointer"
                        >
                            <img
                                src={`/storage/${post.image_path}`}
                                alt={post.caption || `Post ${i + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    ))}
                </div>

                {/* Post Modal */}
                {isPostModalOpen && selectedPost && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div
                            className={`bg-gradient-to-br from-pink-50 to-pink-100/80 rounded-3xl shadow-2xl border border-pink-200/50 backdrop-blur-sm relative max-h-[90vh] overflow-hidden transition-all duration-300 ${
                                showComments
                                    ? "max-w-6xl w-full"
                                    : "max-w-4xl w-full"
                            }`}
                        >
                            {/* Close Button */}
                            <button
                                onClick={handleClosePostModal}
                                className="absolute top-3 right-3 z-10 text-pink-500 hover:text-pink-700 hover:bg-white/80 rounded-full p-2 transition-all duration-200 hover:scale-105 shadow-lg backdrop-blur-sm bg-white/60"
                            >
                                <X size={18} />
                            </button>

                            {/* Main Content */}
                            <div className="flex">
                                {/* Image Section */}
                                <div className="flex-1 p-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-pink-600/20 rounded-2xl blur-xl transform scale-105 opacity-60"></div>
                                        <div className="relative w-full aspect-square overflow-hidden rounded-2xl border-2 border-pink-200/60 shadow-lg bg-black flex items-center justify-center">
                                            <img
                                                src={`/storage/${selectedPost.image_path}`}
                                                alt="Post"
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Post Details Section */}
                                <div className="w-96 flex flex-col">
                                    {/* Header */}
                                    <div className="p-4 border-b border-pink-200/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                {user?.name
                                                    ?.charAt(0)
                                                    .toUpperCase() || "U"}
                                            </div>
                                            <span className="font-medium text-pink-800">
                                                {user?.name || "User"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Caption */}
                                    <div className="p-4 flex-1 overflow-y-auto">
                                        {selectedPost.caption && (
                                            <div className="space-y-2">
                                                <p className="text-pink-700 text-sm leading-relaxed whitespace-pre-line">
                                                    {selectedPost.caption}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="border-t border-pink-200/50 p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={handleLike}
                                                    className={`p-2 rounded-full transition-colors ${
                                                        isLiked
                                                            ? "text-red-500 hover:text-red-600"
                                                            : "text-pink-600 hover:text-pink-800"
                                                    }`}
                                                >
                                                    <Heart
                                                        size={24}
                                                        fill={
                                                            isLiked
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                    />
                                                </button>
                                                <button
                                                    onClick={handleCommentClick}
                                                    className="p-2 text-pink-600 hover:text-pink-800 rounded-full transition-colors"
                                                >
                                                    <MessageCircle size={24} />
                                                </button>
                                                <button className="p-2 text-pink-600 hover:text-pink-800 rounded-full transition-colors">
                                                    <Share size={24} />
                                                </button>
                                            </div>
                                            <button className="p-2 text-pink-600 hover:text-pink-800 rounded-full transition-colors">
                                                <Bookmark size={24} />
                                            </button>
                                        </div>

                                        {/* Like Count */}
                                        <div className="text-sm font-medium text-pink-800">
                                            {likeCount}{" "}
                                            {likeCount === 1 ? "like" : "likes"}
                                        </div>
                                    </div>
                                </div>

                                {/* Comments Panel */}
                                {showComments && (
                                    <div className="w-80 border-l border-pink-200/50 flex flex-col">
                                        <div className="p-4 border-b border-pink-200/50">
                                            <h3 className="font-medium text-pink-800">
                                                Comments
                                            </h3>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4">
                                            {/* Comments will be populated here */}
                                            <div className="text-center text-pink-500 mt-8">
                                                No comments yet
                                            </div>
                                        </div>
                                        <div className="border-t border-pink-200/50 p-4">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Add a comment..."
                                                    className="flex-1 px-3 py-2 border border-pink-200/60 rounded-full focus:outline-none focus:border-pink-300 text-sm bg-white/70 backdrop-blur-sm"
                                                />
                                                <button className="px-4 py-2 text-pink-500 font-medium text-sm hover:text-pink-600 transition-colors">
                                                    Post
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MuseLayout>
    );
};

export default Profile;
