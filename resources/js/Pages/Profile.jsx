import MuseLayout from "../Layouts/MuseLayout";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

const Profile = () => {
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
                                127
                            </div>
                            <div className="text-sm text-pink-600">Posts</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div
                            key={i}
                            className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl overflow-hidden"
                        >
                            <img
                                src={`https://images.unsplash.com/photo-${
                                    1500000000000 + i * 100000000
                                }?w=300&h=300&fit=crop`}
                                alt={`Art piece ${i + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </MuseLayout>
    );
};

export default Profile;
