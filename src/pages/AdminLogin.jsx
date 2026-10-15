import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function AdminLogin() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            alert("Please enter username and password.");
            return;
        }

        // Authentication will be connected to the backend.
        alert("Admin authentication is not connected yet.");
    };

    return (
        <main className="login-page">
            <div className="login-card">
                <h1>Admin Login</h1>

                <form className="login-form" onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Admin username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">Login as Admin</button>
                </form>
            </div>
        </main>
    );
}

export default AdminLogin;
