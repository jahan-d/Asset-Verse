import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer p-10 bg-neutral text-neutral-content rounded-t-3xl mt-10">
            <nav>
                <h6 className="footer-title">Services</h6>
                <Link to="/hr/assets" className="link link-hover">Asset Tracking</Link>
                <Link to="/hr/my-employees" className="link link-hover">Team Management</Link>
                <Link to="/hr/upgrade" className="link link-hover">Enterprise Plans</Link>
            </nav>
            <nav>
                <h6 className="footer-title">Company</h6>
                <Link to="/" className="link link-hover">About us</Link>
                <Link to="/profile" className="link link-hover">Contact</Link>
                <Link to="/join-hr" className="link link-hover">Jobs</Link>
            </nav>
            <nav>
                <h6 className="footer-title">Legal</h6>
                <Link to="/" className="link link-hover">Terms of use</Link>
                <Link to="/" className="link link-hover">Privacy policy</Link>
                <Link to="/" className="link link-hover">Cookie policy</Link>
            </nav>
            <form>
                <h6 className="footer-title">Newsletter</h6>
                <fieldset className="form-control w-80">
                    <label className="label">
                        <span className="label-text text-neutral-content">Enter your email address</span>
                    </label>
                    <div className="join">
                        <input type="text" placeholder="username@site.com" className="input input-bordered join-item text-black" />
                        <button className="btn btn-primary join-item">Subscribe</button>
                    </div>
                </fieldset>
                <div className="mt-6 flex flex-col gap-2">
                    <p className="font-bold text-xl text-primary">AssetVerse</p>
                    <p>© {new Date().getFullYear()} - All rights reserved by <a href="https://jahan-d.web.app" target="_blank" rel="noopener noreferrer" className="link link-hover text-primary font-semibold">Jahan.Dev</a></p>
                </div>
            </form>
        </footer>
    );
};

export default Footer;
