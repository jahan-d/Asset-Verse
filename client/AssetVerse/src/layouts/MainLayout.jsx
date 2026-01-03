import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
    return (
        <div>
            <Navbar />
            <div className="min-h-[calc(100vh-68px)]">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
