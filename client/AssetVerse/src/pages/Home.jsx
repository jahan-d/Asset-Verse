import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { motion } from "framer-motion";
import useAxiosSecure from "../hooks/useAxiosSecure";

const DashboardSummary = () => {
    const { user, dbUser } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: hrRequests = [] } = useQuery({
        queryKey: ['hr-pending-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/requests');
            return res.data.filter(r => r.requestStatus === 'pending');
        },
        enabled: !!user && dbUser?.role === 'hr'
    });

    // Fetch real employee count for HR
    const { data: employeeList = [] } = useQuery({
        queryKey: ['hr-employee-count'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/hr/employees');
            return res.data;
        },
        enabled: !!user && dbUser?.role === 'hr'
    });

    const { data: myAssets = [] } = useQuery({
        queryKey: ['employee-asset-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/my-assets');
            return res.data;
        },
        enabled: !!user && dbUser?.role === 'employee'
    });

    if (!user) return null;

    return (
        <section className="mb-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dbUser?.role === 'hr' ? (
                    <>
                        <div className="card bg-primary text-white shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-3xl font-bold">{hrRequests.length}</h2>
                                <p className="opacity-90">Pending Requests</p>
                                <div className="card-actions justify-end">
                                    <Link to="/hr/requests" className="btn btn-sm btn-ghost bg-white/10">View All</Link>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-secondary text-white shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-3xl font-bold">{employeeList.length} / {dbUser.packageLimit || 5}</h2>
                                <p className="opacity-90">Team Capacity</p>
                                <div className="card-actions justify-end">
                                    <Link to="/hr/my-employees" className="btn btn-sm btn-ghost bg-white/10">Manage Team</Link>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="card bg-accent text-white shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-3xl font-bold">{myAssets.length}</h2>
                                <p className="opacity-90">My Approved Assets</p>
                                <div className="card-actions justify-end">
                                    <Link to="/my-assets" className="btn btn-sm btn-ghost bg-white/10">View List</Link>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-info text-white shadow-xl">
                            <div className="card-body">
                                <h3 className="card-title text-xl">Request New Asset</h3>
                                <p className="opacity-90">Need something for work?</p>
                                <div className="card-actions justify-end">
                                    <Link to="/request-asset" className="btn btn-sm btn-ghost bg-white/10">Request Now</Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

const Home = () => {
    const axiosPublic = useAxiosPublic();
    const { user, dbUser } = useAuth();

    const { data: packages = [], isLoading } = useQuery({
        queryKey: ['packages'],
        queryFn: async () => {
            const res = await axiosPublic.get('/api/packages');
            return res.data;
        }
    });

    return (
        <div className="p-4 md:p-10 max-w-7xl mx-auto">
            {/* Hero Section */}
            <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-3xl mb-12 shadow-2xl">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Welcome to AssetVerse</h1>
                <p className="text-xl max-w-2xl mx-auto mb-10 opacity-90">
                    The ultimate asset management solution for modern enterprises. Track, assign, and manage your company assets with ease.
                </p>
                <div className="flex justify-center gap-4">
                    {!user ? (
                        <>
                            <Link to="/join-employee" className="btn btn-outline btn-white border-2 text-white hover:bg-white hover:text-blue-600 px-8">Join as Employee</Link>
                            <Link to="/join-hr" className="btn bg-white text-blue-600 hover:bg-gray-100 border-none px-8">Join as HR Manager</Link>
                        </>
                    ) : (
                        <div className="flex flex-col items-center">
                            <h2 className="text-2xl font-bold mb-4">Glad to see you back, {user.displayName}!</h2>
                            <Link to={dbUser?.role === 'hr' ? "/hr/assets" : "/my-assets"} className="btn bg-white text-blue-600 hover:bg-gray-100 border-none px-8">
                                Go to Dashboard
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Dashboard Summary (Logged In Users) */}
            <DashboardSummary />

            {/* Why AssetVerse? (Infinite Marquee with Framer Motion) */}
            <section className="my-24 overflow-hidden relative bg-base-200/30 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold">Why AssetVerse?</h2>
                    <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="relative flex">
                    <motion.div
                        className="flex gap-8 whitespace-nowrap min-w-full"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 30,
                                ease: "linear",
                            }
                        }}
                    >
                        {[1, 2].map((loop) => (
                            <div key={loop} className="flex gap-8">
                                <div className="card w-80 bg-base-100 shadow-xl border hover:border-primary transition-all shrink-0">
                                    <div className="card-body">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a22 22 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <h3 className="card-title text-xl">Track Assets</h3>
                                        </div>
                                        <p className="whitespace-normal text-gray-500">Real-time visibility into your inventory and assignments.</p>
                                    </div>
                                </div>
                                <div className="card w-80 bg-base-100 shadow-xl border hover:border-primary transition-all shrink-0">
                                    <div className="card-body">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="card-title text-xl">Paperless Workflow</h3>
                                        </div>
                                        <p className="whitespace-normal text-gray-500">Digital requests, approvals, and returns.</p>
                                    </div>
                                </div>
                                <div className="card w-80 bg-base-100 shadow-xl border hover:border-primary transition-all shrink-0">
                                    <div className="card-body">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-accent/10 rounded-lg text-accent">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <h3 className="card-title text-xl">Smart Insights</h3>
                                        </div>
                                        <p className="whitespace-normal text-gray-500">Analytics to optimize resource allocation.</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Gradient Fade Overlays */}
                    <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-base-200 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-base-200 to-transparent z-10 pointer-events-none"></div>
                </div>
            </section>

            {/* Packages Section (Dynamic) */}
            <section className="my-16">
                <h2 className="text-3xl font-bold text-center mb-10">Our Packages</h2>
                {isLoading ? (
                    <div className="text-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {packages.map((pkg) => (
                            <div key={pkg._id} className="card bg-base-100 shadow-xl border hover:border-primary transition-all">
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title text-2xl">{pkg.name}</h2>
                                    <p className="text-4xl font-bold text-primary my-4">${pkg.price}</p>
                                    <p className="text-sm font-semibold text-gray-500 mb-4">Up to {pkg.employeeLimit} Employees</p>
                                    <ul className="space-y-2 mb-6 text-left w-full pl-4">
                                        {pkg.features?.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2">
                                                <span className="text-green-500">✔</span> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
