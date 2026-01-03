import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

const Navbar = () => {
    const { user, logoutUser, dbUser } = useAuth(); // Get dbUser for role

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error(error);
        }
    };

    const links = (
        <>
            <li><NavLink to="/">Home</NavLink></li>
            {!user && (
                <>
                    <li><NavLink to="/join-employee">Join as Employee</NavLink></li>
                    <li><NavLink to="/join-hr">Join as HR Manager</NavLink></li>
                    <li><NavLink to="/login">Login</NavLink></li>
                </>
            )}
            {
                user && dbUser?.role === 'hr' && (
                    <>
                        <li><NavLink to="/hr/assets">Asset List</NavLink></li>
                        <li><NavLink to="/hr/add-asset">Add Asset</NavLink></li>
                        <li><NavLink to="/hr/requests">All Requests</NavLink></li>
                        <li><NavLink to="/hr/my-employees">My Employees</NavLink></li>
                        {/* Highlights special action */}
                        <li><NavLink to="/hr/upgrade" className="text-warning font-bold">Upgrade</NavLink></li>
                    </>
                )
            }
            {
                user && dbUser?.role === 'employee' && (
                    <>
                        <li><NavLink to="/my-assets">My Assets</NavLink></li>
                        <li><NavLink to="/request-asset">Request Asset</NavLink></li>
                        <li><NavLink to="/my-team">My Team</NavLink></li>
                    </>
                )
            }
        </>
    );

    return (
        <div className="navbar bg-base-100 shadow-md px-4">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {links}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-xl text-primary font-bold">AssetVerse</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2">
                    {links}
                </ul>
            </div>
            <div className="navbar-end">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img alt="Tailwind CSS Navbar component" src={user.photoURL || "https://i.ibb.co.com/6AD8S0D/profile.png"} />
                            </div>
                        </div>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li>
                                <Link to="/profile" className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </Link>
                            </li>
                            {/* TODO: Add role based links explicitly here or let Dashboard handle it */}
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </ul>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-primary text-white">Login</Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
