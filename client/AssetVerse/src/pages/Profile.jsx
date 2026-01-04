import { useAuth } from "../contexts/AuthProvider";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const Profile = () => {
    const { user, dbUser } = useAuth();
    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: user?.displayName,
            photoURL: user?.photoURL
        }
    });
    // Note: To fully support profile updates, we'd need an update endpoint on backend or use Firebase updateProfile + backend sync
    // For this scope, we'll display info and allow simple visual updates (Firebase only for now to keep it safe)

    // Actually, let's just display info neatly as per "Profile Page" requirements usually implies

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-10">
            <div className="card bg-base-100 shadow-xl border">
                <div className="card-body items-center text-center">
                    <div className="avatar">
                        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src={user?.photoURL || "https://i.ibb.co.com/6AD8S0D/profile.png"} alt="Profile" />
                        </div>
                    </div>
                    <h2 className="card-title text-3xl mt-4">{user?.displayName}</h2>
                    <p className="text-gray-500">{user?.email}</p>
                    <div className="badge badge-primary badge-lg uppercase mt-2">{dbUser?.role || "User"}</div>

                    <div className="divider"></div>

                    <div className="w-full text-left">
                        <h3 className="text-xl font-bold mb-4">Account Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Full Name</span>
                                </label>
                                <input type="text" value={user?.displayName} readOnly className="input input-bordered" />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="text" value={user?.email} readOnly className="input input-bordered" />
                            </div>
                            {dbUser?.dateOfBirth && (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Date of Birth</span>
                                    </label>
                                    <input type="text" value={new Date(dbUser.dateOfBirth).toLocaleDateString()} readOnly className="input input-bordered" />
                                </div>
                            )}
                            {dbUser?.role === 'hr' && (
                                <>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Team Size</span>
                                        </label>
                                        <input type="text" value={`${dbUser.currentEmployees || 0} / ${dbUser.packageLimit || 5} Employees`} readOnly className="input input-bordered" />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Subscription</span>
                                        </label>
                                        <input type="text" value={dbUser.subscription || "Basic"} readOnly className="input input-bordered capitalize" />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="mt-8 w-full">
                        <button className="btn btn-neutral w-full" disabled>Edit Profile (Coming Soon)</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
