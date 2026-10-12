import "./OTPVerification.css";
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";

function OTPVerification() {
    const location = useLocation();

    const [otp, setOtp] = useState("");

    const { name, email } = location.state || {};

    const handleVerify = (e) => {
        e.preventDefault();

        if (!/^\d{6}$/.test(otp)) {
            alert("Please enter a valid 6-digit OTP.");
            return;
        }

        alert("OTP verification requires backend integration.");
    };

    if (!email) {
        return (
            <main className="otp-page">
                <div className="otp-card">
                    <h1>Registration Details Missing</h1>
                    <p>Please start registration first.</p>
                    <Link to="/register">Go to Register</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="otp-page">
            <div className="otp-card">
                <h1>Verify Your Email</h1>

                <p>
                    Hi {name}, enter the 6-digit verification code sent to:
                </p>

                <p className="otp-mobile">{email}</p>

                <form onSubmit={handleVerify}>
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) =>
                            setOtp(e.target.value.replace(/\D/g, ""))
                        }
                    />

                    <button type="submit">Verify Email</button>
                </form>

                <p>
                    Wrong email? <Link to="/register">Go back</Link>
                </p>
            </div>
        </main>
    );
}

export default OTPVerification;
