import { router } from "@inertiajs/react";
import {
    Heart,
    Image as Imageicon,
    Palette,
    Plus,
    Search,
    X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const token = localStorage.getItem("token");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedImage) {
            alert("Please select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedImage);
        formData.append("caption", caption); // caption from useState

        try {
            const response = await fetch("/api/create/post", {
                method: "POST",
                headers: {
                    // Do not set Content-Type manually for FormData
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`, // Include token in headers
                },

                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(errorData);
                alert("Failed to create post");
                return;
            }

            // Reload the page after successful post
            window.location.reload();
        } catch (error) {
            console.error("Upload error:", error);
            alert("An error occurred. Try again.");
        }
    };

    // Reset form and close modal
    //     setSelectedImage(null);
    //     setImagePreview(null);
    //     setCaption("");
    //     setIsOpen(false);
    // };

    const handleClose = () => {
        setIsOpen(false);
        setSelectedImage(null);
        setImagePreview(null);
        setCaption("");
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
        <div>
            <nav className="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Palette className="h-8 w-8 text-pink-400" />
                                <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                    ArtMuse
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 max-w-md mx-8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pink-300" />
                                <input
                                    type="text"
                                    placeholder="Search art, artists, or AI prompts..."
                                    className="w-full pl-10 pr-4 py-2 bg-white/70 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                className="p-2 rounded-full hover:bg-pink-100 transition-colors"
                                onClick={() => setIsOpen(true)}
                            >
                                <Plus className="h-6 w-6 text-pink-400" />
                            </button>
                            <button className="p-2 rounded-full hover:bg-pink-100 transition-colors">
                                <Heart className="h-6 w-6 text-pink-400" />
                            </button>
                            <div className="w-8 h-8 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full flex items-center justify-center text-white font-semibold">
                                <a href="/profile">
                                    {user
                                        ? user.name.charAt(0).toUpperCase()
                                        : "U"}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-pink-50 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-pink-100">
                            <h2 className="text-2xl font-serif text-pink-700">
                                Create New Post
                            </h2>
                            <button
                                onClick={handleClose}
                                className="text-pink-500 hover:text-pink-700 hover:bg-pink-100 rounded-full p-2 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-pink-800 font-medium mb-3">
                                    Add a Photo ✨
                                </label>

                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full aspect-square object-cover rounded-2xl border-2 border-pink-200"
                                        />
                                        <button
                                            onClick={() => {
                                                setSelectedImage(null);
                                                setImagePreview(null);
                                            }}
                                            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-pink-500 rounded-full p-2 shadow-lg transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="block">
                                        <div className="border-2 border-dashed border-pink-300 rounded-2xl p-8 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-100 transition-colors">
                                            <Imageicon
                                                size={48}
                                                className="mx-auto text-pink-400 mb-4"
                                            />
                                            <p className="text-pink-600 font-medium mb-2">
                                                Click to upload a photo
                                            </p>
                                            <p className="text-pink-500 text-sm">
                                                PNG, JPG up to 10MB
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {/* Caption */}
                            <div>
                                <label className="block text-pink-800 font-medium mb-3">
                                    Write a Caption 💭
                                </label>
                                <textarea
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    placeholder="Share your thoughts... ✨"
                                    className="w-full p-4 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none bg-pink-100/50"
                                    rows="4"
                                />
                                <div className="text-right mt-2">
                                    <span className="text-pink-500 text-sm">
                                        {caption.length}/500
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 py-3 px-6 border border-pink-300 text-pink-700 rounded-2xl font-medium hover:bg-pink-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!selectedImage || !caption.trim()}
                                    className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-2xl font-medium hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <Heart size={16} />
                                        Share Post
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
