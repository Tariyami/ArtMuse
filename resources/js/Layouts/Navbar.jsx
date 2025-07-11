import { Heart, Palette, Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const token = localStorage.getItem("token");
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
                        setName(userData.name || '');
                        setEmail(userData.email || '');
    
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
                            <button className="p-2 rounded-full hover:bg-pink-100 transition-colors">
                                <Plus className="h-6 w-6 text-pink-400" />
                            </button>
                            <button className="p-2 rounded-full hover:bg-pink-100 transition-colors">
                                <Heart className="h-6 w-6 text-pink-400" />
                            </button>
                            <div className="w-8 h-8 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full flex items-center justify-center text-white font-semibold">
                                <a href="/profile">{user ? user.name.charAt(0).toUpperCase() : "U"}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
