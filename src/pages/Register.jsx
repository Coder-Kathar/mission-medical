import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register(){

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();

        if(
            name.trim() === "" ||
            email.trim() === "" ||
            password.trim() === "" ||
            confirmPassword.trim() === ""
        ){
            alert("Please fill in all the fields.");
            return;
        }

        if(!/^[A-Za-z ]+$/.test(name)){
            alert("Name should contain only letters.");
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
        if(password !== confirmPassword){
            alert("Passwords do not match.");
            return;
        }

        alert("Registration successful!");
        navigate("/login");
    };
    return (
        
        <main className="register-page">

            <div className="register-card">

                <h1>Create Account</h1>

                <form className="register-form" onSubmit={handleRegister}>

                    <input type="text" 
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}/>

                    <input type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}/>

                    <input type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />

                    <input type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} />

                    <button type="submit">
                        Register
                    </button>
                </form>

                <p>
                    Already have an account?{" "} 
                    <Link to="/login">Login</Link>
                </p>
            </div>

        </main>
    );
}

export default Register;