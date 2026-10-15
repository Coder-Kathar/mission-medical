import "./LoginSelection.css";
import { Link } from "react-router-dom";

function LoginSelection() {
    return (
        <main className="login-selection-page">
            <div className="login-selection-container">
                <h1>Welcome to Mission Medical</h1>
                <p>Select your account type to continue.</p>

                <div className="login-selection-cards">
                    <Link to="/customer-login" className="login-selection-card">
                        <span className="login-selection-icon">👤</span>
                        <h2>Customer Login</h2>
                        <p>Browse products and manage your orders.</p>
                        <span className="login-selection-action">
                            Continue →
                        </span>
                    </Link>

                    <Link to="/admin-login" className="login-selection-card">
                        <span className="login-selection-icon">🛡️</span>
                        <h2>Admin Login</h2>
                        <p>Manage products, orders, and deliveries.</p>
                        <span className="login-selection-action">
                            Continue →
                        </span>
                    </Link>

                    <Link to="/worker-login" className="login-selection-card">
                        <span className="login-selection-icon">🚚</span>
                        <h2>Worker Login</h2>
                        <p>Access delivery and order tasks.</p>
                        <span className="login-selection-action">
                            Continue →
                        </span>
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default LoginSelection;
