import { useState } from "react";
import "./Login.css";

function WorkerLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            alert("Please enter username and password.");
            return;
        }

        alert("Worker authentication is not connected yet.");
    };

    return (
        <main className="login-page">
            <div className="login-card">
                <h1>Worker Login</h1>

                <form className="login-form" onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Worker username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">Login as Worker</button>
                </form>
            </div>
        </main>
    );
}

export default WorkerLogin;
