import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

const HRRoute = ({ children }) => {
    const { user, loading, dbUser } = useAuth();
    const location = useLocation();

    if (loading || !dbUser) { // Wait for DB profile sync
        return <span className="loading loading-bars loading-lg"></span>
    }

    if (user && dbUser.role === 'hr') {
        return children;
    }

    // Redirect to home or unauthorized page
    return <Navigate to="/" replace></Navigate>;
};

export default HRRoute;
