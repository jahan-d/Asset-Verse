import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import toast from "react-hot-toast";

const JoinHR = () => {
    const { createUser } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const companyName = form.companyName.value;
        const companyLogo = form.companyLogo.value;
        const email = form.email.value;
        const password = form.password.value;
        const dob = form.dob.value;

        try {
            await createUser(email, password, name, "", {
                role: "hr",
                companyName,
                companyLogo,
                dateOfBirth: dob
            });
            toast.success("HR Registration Successful");
            navigate("/");
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Join as HR Manager</h1>
                    <p className="py-6">Register your company and start managing assets today.</p>
                </div>
                <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form onSubmit={handleRegister} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>
                            <input type="text" name="name" placeholder="John Doe" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Company Name</span>
                            </label>
                            <input type="text" name="companyName" placeholder="Tech Corp" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Company Logo URL</span>
                            </label>
                            <input type="url" name="companyLogo" placeholder="https://..." className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" name="email" placeholder="hr@company.com" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Date of Birth</span>
                            </label>
                            <input type="date" name="dob" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" name="password" placeholder="password" className="input input-bordered" required />
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary text-white">Sign Up</button>
                        </div>
                        <p className="text-center mt-2">
                            Not an HR Manager?{" "}
                            <Link className="text-primary font-bold" to="/join-employee">
                                Join as Employee
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JoinHR;
