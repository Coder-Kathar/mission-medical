import "./Login.css";
import { Link, useNavigate} from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login(){

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        if(mobileNumber.trim() === "" || password.trim() === ""){
            alert("Please enter mobile number and password.");
            return;
        }

        if(!/^\d{10}$/.test(mobileNumber)){
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }

        if (password.length < 8) {
            alert("Password must contain at least 8 characters.");
            return;
        }

        login({
            mobileNumber
        });

        alert("Login successful!");

        navigate("/");
    };

    return (
        <main className="login-page">

            <div className="login-card">

                <h1>Login</h1>

                <form className="login-form" onSubmit={handleLogin}>

                    <input type="tel" 
                            placeholder="10 - digit mobile number"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}/>

                    <input type="password"
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}/>

                    <button type="submit">
                        Login
                    </button>

                </form>

                <p>
                    Don't have an account?{" "} 
                    <Link to="/register">Register</Link>
                </p>
            </div>
        </main>
    );
}

export default Login;