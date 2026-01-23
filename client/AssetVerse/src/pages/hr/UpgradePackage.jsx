import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthProvider";

const UpgradePackage = () => {
    const axiosSecure = useAxiosSecure();
    const [searchParams, setSearchParams] = useSearchParams();
    const { refreshProfile } = useAuth();

    // Handle Payment Return
    useEffect(() => {
        const sessionId = searchParams.get("session_id");
        if (searchParams.get("success") && sessionId) {
            const verifyPayment = async () => {
                const loadingToast = toast.loading("Verifying your payment...");
                try {
                    const res = await axiosSecure.post("/api/payments/verify", { session_id: sessionId });
                    if (res.data.success) {
                        toast.success("Payment Verified! Account Upgraded.", { id: loadingToast });
                        // Refresh user profile to show updated package limits
                        await refreshProfile();
                        // Clear search params to prevent re-verification on refresh
                        setSearchParams({});
                    }
                } catch (error) {
                    console.error(error);
                    toast.error("Verification failed. Please contact support.", { id: loadingToast });
                }
            };
            verifyPayment();
        }
        if (searchParams.get("canceled")) {
            toast.error("Payment Cancelled.");
            setSearchParams({});
        }
    }, [searchParams, axiosSecure, setSearchParams, refreshProfile]);


    const { data: packages = [] } = useQuery({
        queryKey: ['packages-upgrade'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/packages');
            return Array.isArray(res.data) ? res.data : [];
        }
    });

    const handleUpgrade = async (packageId) => {
        try {
            const res = await axiosSecure.post("/create-checkout-session", { packageId });
            if (res.data.url) {
                window.location.href = res.data.url;
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to initiate payment");
        }
    };

    return (
        <div className="p-4 md:p-10 text-center">
            <h2 className="text-4xl font-bold mb-4">Upgrade Your Plan</h2>
            <p className="mb-10 text-gray-500">Increase your employee limit to scale your business.</p>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {(Array.isArray(packages) ? packages : []).map((pkg) => (
                    <div key={pkg._id} className="card bg-base-100 shadow-xl border-2 border-transparent hover:border-primary transition-all">
                        <div className="card-body">
                            <h2 className="card-title justify-center text-3xl">{pkg.name}</h2>
                            <p className="text-5xl font-bold text-primary my-4">${pkg.price}</p>
                            <p className="font-semibold text-gray-500">Up to {pkg.employeeLimit} Employees</p>
                            <div className="divider"></div>
                            <ul className="text-left space-y-2 mb-6">
                                {(Array.isArray(pkg.features) ? pkg.features : []).map((f, i) => (
                                    <li key={i} className="flex gap-2"><span className="text-green-500">✔</span> {f}</li>
                                ))}
                            </ul>
                            <div className="card-actions justify-center">
                                <button
                                    onClick={() => handleUpgrade(pkg._id)}
                                    className="btn btn-primary w-full text-white text-lg"
                                >
                                    Upgrade to {pkg.name}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpgradePackage;
