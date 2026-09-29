import "./Login.css";
import { Link, useNavigate} from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login(){

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        if(email.trim() === "" || password.trim() === ""){
            alert("Please enter email and password.");
            return;
        }

        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            alert("Please enter a valid email address.");
            return;
        }

        if(password.length < 8){
            alert("Password must be at least 8 characters.");
            return;
        }

        login({
            email : email
        });

        alert("Login successful!");

        navigate("/");
    };

    return (
        <main className="login-page">

            <div className="login-card">

                <h1>Login</h1>

                <form className="login-form" onSubmit={handleLogin}>

                    <input type="email" 
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}/>

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