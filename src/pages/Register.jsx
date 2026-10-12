import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [email, setEmail] = useState("");
    const [registrationType, setRegistrationType] = useState("password");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();

        if (
            name.trim() === "" ||
            mobileNumber.trim() === "" ||
            email.trim() === ""
        ) {
            alert("Please fill in your name, mobile number, and email.");
            return;
        }

        if (!/^[A-Za-z ]+$/.test(name)) {
            alert("Name should contain only letters.");
            return;
        }

        if (!/^\d{10}$/.test(mobileNumber)) {
            alert("Enter a valid 10-digit mobile number.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (registrationType === "password") {
            if (password.length < 8) {
                alert("Password must be at least 8 characters.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }
        }

        if (registrationType === "passwordless") {
            navigate("/verify-otp", {
                state: {
                    name,
                    mobileNumber,
                    email,
                    registrationType
                }
            });
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
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="tel"
                        placeholder="10-digit Mobile Number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className="registration-options">
                        <label>
                            <input
                                type="radio"
                                name="registrationType"
                                value="password"
                                checked={registrationType === "password"}
                                onChange={() => setRegistrationType("password")}
                            />
                            With Password
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="registrationType"
                                value="passwordless"
                                checked={registrationType === "passwordless"}
                                onChange={() => setRegistrationType("passwordless")}
                            />
                            Without Password
                        </label>
                    </div>

                    {registrationType === "password" && (
                        <>
                            <input
                                type="password"
                                placeholder="Password (minimum 8 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </>
                    )}

                    <button type="submit">Register</button>
                </form>

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </main>
    );
}

export default Register;