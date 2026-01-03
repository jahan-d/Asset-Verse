import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";

const Home = () => {
    const axiosPublic = useAxiosPublic();

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
            <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-3xl mb-12 shadow-xl">
                <h1 className="text-5xl font-bold mb-4">Welcome to AssetVerse</h1>
                <p className="text-xl max-w-2xl mx-auto">
                    The ultimate asset management solution for modern enterprises. Track, assign, and manage your company assets with ease.
                </p>
            </section>

            {/* About Section */}
            <section className="my-12 text-center">
                <h2 className="text-3xl font-bold mb-8">Why AssetVerse?</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="card bg-base-100 shadow-xl border">
                        <div className="card-body">
                            <h3 className="card-title justify-center text-primary">Track Assets</h3>
                            <p>Real-time visibility into your inventory and assignments.</p>
                        </div>
                    </div>
                    <div className="card bg-base-100 shadow-xl border">
                        <div className="card-body">
                            <h3 className="card-title justify-center text-primary">Paperless Workflow</h3>
                            <p>Digital requests, approvals, and returns.</p>
                        </div>
                    </div>
                    <div className="card bg-base-100 shadow-xl border">
                        <div className="card-body">
                            <h3 className="card-title justify-center text-primary">Smart Insights</h3>
                            <p>Analytics to optimize resource allocation.</p>
                        </div>
                    </div>
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
