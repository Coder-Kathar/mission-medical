import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* Brand Information */}
                <div className="footer-section footer-about">
                    <h3>Makkal Marunthagam</h3>

                    <h4>
                        Pradhan Mantri Bhartiya Jan Aushadhi Kendra
                    </h4>

                    <p>All Quality Generic Medicine</p>

                    <p className="footer-discount">
                        Discount from 30% to 90%
                    </p>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h4>Quick Links</h4>

                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/cart">Request Cart</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </ul>
                </div>

                {/* Contact Information */}
                <div className="footer-section">
                    <h4>Contact Us</h4>

                    <p>Mobile Numbers</p>

                    <ul>
                        <li>
                            <a href="tel:+919444912126">
                                +91 94449 12126
                            </a>
                        </li>

                        <li>
                            <a href="tel:+919363857742">
                                +91 93638 57742
                            </a>
                        </li>
                    </ul>

                    <h4 className="footer-address-heading">
                        Our Address
                    </h4>

                    <address>
                        No. 1/147, PH Road,<br />
                        Sivabhootham Vanagaram,<br />
                        Chennai, Tamil Nadu – 600 095.
                    </address>
                </div>

                {/* Customer Information */}
                <div className="footer-section">
                    <h4>Customer Information</h4>

                    <p>
                        Explore quality generic medicines
                        and healthcare products.
                    </p>

                    <p>
                        Please consult a qualified healthcare
                        professional about medicine use.
                    </p>

                    <p>
                        Prescription medicines are subject
                        to applicable prescription requirements.
                    </p>
                </div>

            </div>

            {/* Copyright */}
            <div className="footer-bottom">
                <p>
                    © {new Date().getFullYear()} Makkal Marunthagam.
                    All rights reserved.
                </p>

                <p>Your Health, Our Priority.</p>
            </div>
        </footer>
    );
}

export default Footer;
