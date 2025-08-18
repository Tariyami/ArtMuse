import {
    Bookmark,
    Grid,
    Heart,
    MessageCircle,
    Send,
    Share2,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const Posts = () => {
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [savedPosts, setSavedPosts] = useState(new Set());
    const [posts, setPosts] = useState([]);
    const [commentInputs, setCommentInputs] = useState({});
    const [showComments, setShowComments] = useState({});
    const [postComments, setPostComments] = useState({});
    const [isLoadingComments, setIsLoadingComments] = useState({});
    console.log(posts);

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

    const handleSave = (postId) => {
        setSavedPosts((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    };

    const handleCommentInputChange = (postId, value) => {
        setCommentInputs((prev) => ({
            ...prev,
            [postId]: value,
        }));
    };

    const handleSubmitComment = async (postId, post) => {
        const commentContent = commentInputs[postId];
        if (!commentContent?.trim()) return;

        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ content: commentContent }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Add the new comment to the post comments
            setPostComments((prev) => ({
                ...prev,
                [postId]: [data.comment, ...(prev[postId] || [])],
            }));

            // Update the post's comment count
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? { ...post, comments: post.comments + 1 }
                        : post
                )
            );

            // Clear the comment input
            setCommentInputs((prev) => ({
                ...prev,
                [postId]: "",
            }));
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    const fetchComments = async (postId) => {
        if (postComments[postId]) {
            // Comments already loaded, just toggle visibility
            setShowComments((prev) => ({
                ...prev,
                [postId]: !prev[postId],
            }));
            return;
        }

        setIsLoadingComments((prev) => ({ ...prev, [postId]: true }));

        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setPostComments((prev) => ({
                ...prev,
                [postId]: data.comments,
            }));

            setShowComments((prev) => ({
                ...prev,
                [postId]: true,
            }));
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setIsLoadingComments((prev) => ({ ...prev, [postId]: false }));
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("/api/view/posts", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                // Process posts to handle commentsActual if present
                const processedPosts = data.posts.map((post) => ({
                    ...post,
                    // Use commentsActual length if it exists, otherwise use comments count
                    comments: post.commentsActual
                        ? post.commentsActual.length
                        : post.comments || 0,
                }));

                setPosts(processedPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);

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
                            src={`/storage/${post.image}`}
                            alt="Art post"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={async () => {
                                        handleLike(post.id);
                                        post.likes += post.has_liked ? -1 : 1;
                                        post.has_liked = !post.has_liked;

                                        try {
                                            const response = await fetch(
                                                `/api/like/post/${post.id}`,
                                                {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type":
                                                            "application/json",
                                                        Authorization: `Bearer ${localStorage.getItem(
                                                            "token"
                                                        )}`,
                                                    },
                                                }
                                            );
                                            if (!response.ok) {
                                                throw new Error(
                                                    `HTTP error! Status: ${response.status}`
                                                );
                                            }
                                        } catch (error) {
                                            console.error(
                                                "Error liking post:",
                                                error
                                            );
                                        }
                                    }}
                                    className={`flex items-center space-x-1 transition-colors ${
                                        likedPosts.has(post.id)
                                            ? "text-pink-500"
                                            : "text-pink-400 hover:text-pink-500"
                                    }`}
                                >
                                    <Heart
                                        className={`h-6 w-6 ${
                                            post.has_liked ? "fill-current" : ""
                                        }`}
                                    />
                                    <span className="text-sm font-medium">
                                        {post.likes}
                                    </span>
                                </button>
                                <button
                                    onClick={() => fetchComments(post.id)}
                                    className="flex items-center space-x-1 text-pink-400 hover:text-pink-500"
                                >
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

                        <p className="text-pink-800 text-sm leading-relaxed mb-3">
                            {post.caption}
                        </p>

                        {/* Comments Section */}
                        {showComments[post.id] && (
                            <div className="mb-4 max-h-60 overflow-y-auto">
                                {isLoadingComments[post.id] ? (
                                    <div className="text-center text-pink-400 py-2">
                                        Loading comments...
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {postComments[post.id]?.map(
                                            (comment) => (
                                                <div
                                                    key={comment.id}
                                                    className="flex space-x-2 bg-pink-50 p-2 rounded-lg"
                                                >
                                                    <div className="w-6 h-6 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                                        {comment.user.avatar}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-1">
                                                            <span className="font-medium text-pink-800 text-sm">
                                                                {
                                                                    comment.user
                                                                        .name
                                                                }
                                                            </span>
                                                            <span className="text-pink-400 text-xs">
                                                                {comment.time}
                                                            </span>
                                                        </div>
                                                        <p className="text-pink-700 text-sm">
                                                            {comment.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Comment Input */}
                        <div className="mt-3 pt-3 border-t border-pink-100">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full"></div>
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={commentInputs[post.id] || ""}
                                    onChange={(e) =>
                                        handleCommentInputChange(
                                            post.id,
                                            e.target.value
                                        )
                                    }
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleSubmitComment(post.id);
                                        }
                                    }}
                                    className="flex-1 text-sm text-pink-700 placeholder-pink-400 bg-transparent focus:outline-none"
                                />
                                <button
                                    onClick={() =>
                                        handleSubmitComment(post.id, post)
                                    }
                                    className="text-pink-400 hover:text-pink-600 transition-colors"
                                    disabled={!commentInputs[post.id]?.trim()}
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Posts;
