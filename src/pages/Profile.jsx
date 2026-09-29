import "./Profile.css";
import { useState } from "react";

function Profile(){

    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState("Alex");
    const [email, setEmail] = useState("alex@gmail.com");
    const [phone, setPhone] = useState("9876543210");
    const [address, setAddress] = useState("Chennai, Tamil Nadu");

    const handleSave = () => {
        setIsEditing(false);
        alert("Profile updated successfully!");
    };

    return (
        <main className="profile-page">

            <div className="profile-card">

                <h1>My Profile</h1>

                {isEditing ? (
                    <>
                        <div className="profile-form">

                            <input type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} />
                            
                            <input type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} />

                            <input type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)} />

                            <textarea value={address}
                                        onChange={(e) => setAddress(e.target.value)}/>
                        </div>

                        <button onClick={handleSave}>
                            Save Changes
                        </button>
                    </>
                ) : (
                    <>
                    <div className="profile-info">

                        <p><strong>Name:</strong> {name}</p>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Phone:</strong> {phone}</p>
                        <p><strong>Address:</strong> {address}</p>
                    </div>

                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                    </>
            )}
            </div>
        </main>
    );
}

export default Profile;