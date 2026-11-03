import {
    Link,
    useNavigate,
    useSearchParams
} from "react-router-dom";
import "./Navbar.css";
import { useContext, useState, useEffect } from "react";
import { RequestContext } from "../context/RequestContext";
import { AuthContext } from "../context/AuthContext";
import { UserRound, Sun, Moon } from "lucide-react";

function Navbar() {

    const navigate = useNavigate();

    const { user, logout } = useContext(AuthContext);
    const { requestItems } = useContext(RequestContext);

    const [searchParams] = useSearchParams();

    const [searchTerm, setSearchTerm] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    // Synchronize search input with URL
    useEffect(() => {
        setSearchTerm(searchParams.get("search") || "");
    }, [searchParams]);

    // Theme management
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

    // Search functionality
    const handleSearch = () => {
        const trimmedSearch = searchTerm.trim();

        if (trimmedSearch !== "") {
            navigate(
                `/products?search=${encodeURIComponent(trimmedSearch)}`
            );
            setMenuOpen(false);
        }
    };

    // Close navigation menus
    const closeMenus = () => {
        setMenuOpen(false);
        setProfileOpen(false);
    };

    // Logout functionality
    const handleLogout = () => {
        logout();
        closeMenus();
        navigate("/");
    };

    return (
        <nav className="navbar">

            {/* Logo */}
            <Link to="/" className="logo" onClick={closeMenus}>
                <img
                    src="/makkal-marunthagam-hd-logo.png"
                    alt="Makkal Marunthagam logo"
                    className="logo-image"
                />

                <span className="logo-name">
                    <span>Makkal</span>
                    <span>Marunthagam</span>
                </span>
            </Link>

            {/* Search Box */}
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search medicines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                />

                <button
                    type="button"
                    onClick={handleSearch}
                    aria-label="Search"
                >
                    🔍
                </button>
            </div>

            {/* Navbar Actions */}
            <div className="navbar-actions">

                {/* Theme Toggle */}
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

                {/* User Profile */}
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

                                <Link
                                    to="/profile"
                                    state={{ editMode: false }}
                                    onClick={closeMenus}
                                >
                                    My Profile
                                </Link>

                                <Link
                                    to="/profile"
                                    state={{ editMode: true }}
                                    onClick={closeMenus}
                                >
                                    Edit Profile
                                </Link>

                                <Link
                                    to="/profile"
                                    onClick={closeMenus}
                                >
                                    Security / Login Details
                                </Link>

                                <Link
                                    to="/orders"
                                    onClick={closeMenus}
                                >
                                    My Orders
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                >
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

                {/* Navigation Menu Toggle */}
                <button
                    type="button"
                    className={`menu-toggle ${requestItems.length > 0 ? "has-notification" : ""}`}
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

                    {requestItems.length > 0 && (
                        <span
                            className="notification-dot"
                            aria-label="Items in Request Cart"
                        />
                    )}
                </button>

            </div>

            {/* Navigation Dropdown */}
            {menuOpen && (
                <div className="navigation-dropdown">

                    <Link to="/" onClick={closeMenus}>
                        Home
                    </Link>

                    <Link to="/products" onClick={closeMenus}>
                        Products
                    </Link>

                    {user && (
                        <Link
                            to="/request"
                            className="request-cart-link"
                            onClick={closeMenus}
                        >
                            <span>Request Cart</span>

                            {requestItems.length > 0 && (
                                <span
                                    className="request-notification-dot"
                                    aria-label="Items waiting in Request Cart"
                                />
                            )}
                        </Link>
                    )}

                </div>
            )}

        </nav>
    );
}

export default Navbar;