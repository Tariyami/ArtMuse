import { usePage } from "@inertiajs/react";
import axios from "axios";
import { Camera, Home, Search, Settings, Sparkles, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";



const Sidebar = () => {
    const { url } = usePage();

    const [activeTab, setActiveTab] = useState("");

    useEffect(() => {
        // Set active tab based on current path
        const path = url.replace(/^\/+/, ""); // remove leading slash
        const tabMap = {
            "": "feed",
            feed: "feed",
            explore: "explore",
            create: "create",
            "ai-generate": "ai",
            ai: "ai",
            profile: "profile",
            settings: "settings",
            logout: "logout",
        };

        // Find the first matching tab key
        const matchedKey = Object.keys(tabMap).find(
            (key) => path === key || path.startsWith(key + "/")
        );

        setActiveTab(matchedKey ? tabMap[matchedKey] : "");
    }, [url]);

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 relative">
            <div className="w-64 bg-gradient-to-b from-pink-50/50 to-purple-50/50 backdrop-blur-sm border-r border-pink-100 h-screen sticky top-16">
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        {[
                            { icon: Home, label: "feed", key: "feed" },
                            { icon: Search, label: "explore", key: "explore" },
                            { icon: Camera, label: "create", key: "create" },
                            { icon: Sparkles, label: "ai-generate", key: "ai" },
                            { icon: User, label: "profile", key: "profile" },
                            {
                                icon: Settings,
                                label: "Settings",
                                key: "settings",
                            },{
                                icon: LogOut,
                                label: "Logout",
                                key: "logout",
                            },
                        ].map(({ icon: Icon, label, key }) => (
                            <button
                                key={key}
                                onClick={async () => {
                                    if (key === "logout") {
                                            const token = localStorage.getItem("token"); // or "auth_token", depending on how you stored it

                                            if (!token) {
                                                console.error("No token found in localStorage");
                                                return;
                                            }

                                            try {
                                                await axios.post("/api/logout", {}, {
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        "Accept": "application/json",
                                                        "X-Requested-With": "XMLHttpRequest",
                                                        "Authorization": `Bearer ${token}`,
                                                    },
                                                });

                                                // Optional: Remove token and redirect user
                                                localStorage.removeItem("token");
                                                window.location.href = "/login"; // or router.push if using React Router / Inertia
                                                return
                                            } catch (error) {
                                                console.error("Logout failed", error);
                                            }
                                        }

                                    setActiveTab(key);
                                    window.location.href = `/${label}`;
                                }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                                    activeTab === key
                                        ? "bg-gradient-to-r from-pink-200 to-purple-200 text-pink-800 shadow-sm"
                                        : "hover:bg-pink-100/50 text-pink-600"
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="border-t border-pink-100 pt-6">
                        <h3 className="text-sm font-semibold text-pink-800 mb-3">
                            Suggested Artists
                        </h3>
                        <div className="space-y-3">
                            {[
                                "🌸 Rose Garden",
                                "🦋 Butterfly Dreams",
                                "🌙 Lunar Art",
                            ].map((artist, i) => (
                                <div
                                    key={i}
                                    className="flex items-center space-x-3"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full flex items-center justify-center text-white text-sm">
                                        {artist.split(" ")[0]}
                                    </div>
                                    <span className="text-sm text-pink-700">
                                        {artist.split(" ").slice(1).join(" ")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
