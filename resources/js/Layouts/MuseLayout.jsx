import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MuseLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <div className="flex-1 min-h-screen">{children}</div>
            </div>
        </div>
    );
};

export default MuseLayout;
