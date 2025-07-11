import MuseLayout from "../Layouts/MuseLayout";
import Post from "./components/Posts";
const Feed = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
        return null; // Prevent rendering if not authenticated
    }
    return (
        <div>
            <MuseLayout>
                <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-50 to-purple-50">
                    <h1 className="text-4xl font-bold text-pink-600 mb-8">Welcome to the Feed</h1>
                    <Post />
                </div>
            </MuseLayout>
        </div>
    );
};

export default Feed;
