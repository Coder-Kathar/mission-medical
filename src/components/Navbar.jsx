import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";


function Navbar(){

    const {user, logout} = useContext(AuthContext);

    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    const handleSearch = () => {
        if(searchTerm.trim() !== ""){
            navigate(`/products?search=${searchTerm}`);
        }
    };
    return (
        <nav className="navbar">
            <div className="logo">
                Mission Medical
            </div>

            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>

                <div className="search-box">
                    <input type="text" 
                            placeholder="Search medicines..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key === "Enter"){
                                    handleSearch();
                                }
                            }}/>
                    <button onClick={handleSearch}>🔍</button>
                </div>
                
                <Link to="/request">Request</Link>
                
                <Link to="/profile">Profile</Link>
                
                {user ? (
                    <button onClick={logout}>Logout</button>
                ) : (
                    <Link to="/login">Login</Link>
                )}
                
            </div>
        </nav>
    );
}

export default Navbar;