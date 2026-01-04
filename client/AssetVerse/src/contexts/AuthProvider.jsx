import { createContext, useEffect, useState, useContext } from "react";
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";
import app from "../firebase/firebase.init";
import axios from "axios";

export const AuthContext = createContext(null);
const auth = getAuth(app);

// Custom Hook for easier usage
export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dbUser, setDbUser] = useState(null); // The MongoDB user profile

    // API URL from env (ensure Vite exposes it)
    // We'll hardcode localhost for dev if env missing, but plan is env.
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const createUser = async (email, password, name, photoURL, extraData) => {
        setLoading(true);
        // 1. Firebase Create
        const result = await createUserWithEmailAndPassword(auth, email, password);

        // 2. MongoDB Create (Critical Phase)
        // We do this BEFORE the observer might fully settle/redirect to ensure data exists.
        try {
            await axios.post(`${API_URL}/users`, {
                email,
                name: name || "User",
                photoURL: photoURL || "",
                role: extraData?.role || "employee",
                ...extraData
            });

            // 3. Update Firebase Profile
            await updateProfile(result.user, {
                displayName: name,
                photoURL: photoURL
            });

        } catch (err) {
            console.error("Backend User Creation Failed:", err);
            // Clean up firebase user? Or just let user try again / Login repair?
        }

        return result;
    };

    const loginUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logoutUser = () => {
        setLoading(true);
        return signOut(auth);
    };

    const refreshProfile = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem("access-token");
            const profileRes = await axios.get(`${API_URL}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDbUser(profileRes.data);
        } catch (err) {
            console.error("Profile Refresh Failed", err);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Get JWT
                try {
                    const tokenRes = await axios.post(`${API_URL}/jwt`, { token: await currentUser.getIdToken() });
                    localStorage.setItem("access-token", tokenRes.data.token);

                    // Sync MongoDB Profile
                    const profileRes = await axios.get(`${API_URL}/api/users/profile`, {
                        headers: { Authorization: `Bearer ${tokenRes.data.token}` }
                    });
                    setDbUser(profileRes.data);
                } catch (err) {
                    console.error("Auth Sync Failed", err);
                    // If 404, maybe retry or logout?
                }
            } else {
                localStorage.removeItem("access-token");
                setDbUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [API_URL]);

    const authInfo = {
        user,
        dbUser, // Expose the DB profile (role, affiliation)
        loading,
        createUser,
        loginUser,
        logoutUser,
        refreshProfile
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
