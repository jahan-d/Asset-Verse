import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import toast from "react-hot-toast";

const JoinEmployee = () => {
    const { createUser } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const dob = form.dob.value;

        try {
            // Role is implicitly 'employee' handled by backend default or passed here
            await createUser(email, password, name, "", {
                role: "employee",
                dateOfBirth: dob
            });
            toast.success("Employee Registration Successful");
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
                    <h1 className="text-5xl font-bold">Join as Employee</h1>
                    <p className="py-6">Register to find your company and request assets.</p>
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
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" name="email" placeholder="email" className="input input-bordered" required />
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
                            Are you an HR Manager?{" "}
                            <Link className="text-primary font-bold" to="/join-hr">
                                Join as HR
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JoinEmployee;
