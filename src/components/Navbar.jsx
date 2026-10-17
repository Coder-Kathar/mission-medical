import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserRound } from "lucide-react";
import { Sun, Moon } from "lucide-react";
import { useEffect } from "react";

function Navbar() {
    const { user, logout } = useContext(AuthContext);

    const [searchTerm, setSearchTerm] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((currentTheme) =>
            currentTheme === "light" ? "dark" : "light"
        );
    };

    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchTerm.trim() !== "") {
            navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
            setMenuOpen(false);
        }
    };

    const closeMenus = () => {
        setMenuOpen(false);
        setProfileOpen(false);
    };

    const handleLogout = () => {
        logout();
        closeMenus();
        navigate("/");
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo" onClick={closeMenus}>
                Makkal Marunthagam
            </Link>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search medicines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                    }}
                />
                <button type="button" onClick={handleSearch} aria-label="Search">
                    🔍
                </button>
            </div>

            <div className="navbar-actions">

                <button
                    type="button"
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                    title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                >
                    {theme === "light" ? (
                        <Moon size={21} />
                    ) : (
                        <Sun size={21} />
                    )}
                </button>

                {user ? (
                    <div className="profile-wrapper">
                        <button
                            type="button"
                            className="profile-avatar"
                            aria-label="Open profile menu"
                            aria-expanded={profileOpen}
                            onClick={() => {
                                setProfileOpen(!profileOpen);
                                setMenuOpen(false);
                            }}
                        >
                            <UserRound size={23} strokeWidth={1.7} />
                        </button>

                        {profileOpen && (
                            <div className="profile-dropdown">
                                <Link to="/profile" state={{ editMode: false}} onClick={closeMenus}>
                                    My Profile
                                </Link>
                                <Link to="/profile" state={{ editMode: true}} onClick={closeMenus}>
                                    Edit Profile
                                </Link>
                                <Link to="/profile" onClick={closeMenus}>
                                    Security / Login Details
                                </Link>
                                <Link to="/orders" onClick={closeMenus}>
                                    My Orders
                                </Link>
                                <button type="button" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="navbar-login">
                        Login
                    </Link>
                )}

                <button
                    type="button"
                    className="menu-toggle"
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                    onClick={() => {
                        setMenuOpen(!menuOpen);
                        setProfileOpen(false);
                    }}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {menuOpen && (
                <div className="navigation-dropdown">
                    <Link to="/" onClick={closeMenus}>Home</Link>
                    <Link to="/products" onClick={closeMenus}>Products</Link>

                    {user && (
                        <>
                            <Link to="/request" onClick={closeMenus}>Request Cart</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
