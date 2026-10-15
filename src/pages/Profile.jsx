import "./Profile.css";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

function Profile() {
    const { user } = useContext(AuthContext);

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(
        user?.mobileNumber || user?.phone || ""
    );
    const [address, setAddress] = useState(user?.address || "");

    const location = useLocation();
    const [isEditing, setIsEditing] = useState(
        location.state?.editMode === true
    );

    useEffect(() => {
        setName(user?.name || "");
        setEmail(user?.email || "");
        setPhone(user?.mobileNumber || user?.phone || "");
        setAddress(user?.address || "");
    }, [user]);

    useEffect(() => {
        setIsEditing(location.state?.editMode === true);
    }, [location.key, location.state]);

    const handleSave = () => {
        if (!name.trim() || !/^\d{10}$/.test(phone.trim()) || !address.trim()) {
            alert("Please enter a valid name, 10-digit mobile number, and address.");
            return;
        }

        // Persistence will be connected to AuthContext/backend later.
        setIsEditing(false);
        alert("Profile form validated. Saving to your account is not connected yet.");
    };

    return (
        <main className="profile-page">
            <div className="profile-card">
                <h1>My Profile</h1>

                {isEditing ? (
                    <>
                        <div className="profile-form">
                            <label>
                                Name
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </label>

                            <label>
                                Email
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </label>

                            <label>
                                Mobile Number
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </label>

                            <label>
                                Delivery Address
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </label>
                        </div>

                        <button onClick={handleSave}>Save Changes</button>
                        <button
                            className="profile-cancel-button"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <div className="profile-info">
                            <p><strong>Name:</strong> {name || "Not provided"}</p>
                            <p><strong>Email:</strong> {email || "Not provided"}</p>
                            <p><strong>Phone:</strong> {phone || "Not provided"}</p>
                            <p><strong>Address:</strong> {address || "Not provided"}</p>
                        </div>

                        <button onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </button>
                    </>
                )}
            </div>
        </main>
    );
}

export default Profile;
