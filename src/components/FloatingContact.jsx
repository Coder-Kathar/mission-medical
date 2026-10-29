import "./FloatingContact.css";

const PHONE_NUMBER = "919444912126";

function FloatingContact() {
    return (
        <div className="floating-contact">
            {/* WhatsApp button */}
            <a
                className="floating-contact-btn whatsapp-btn"
                href={`https://wa.me/${PHONE_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Makkal Marunthagam on WhatsApp"
                title="Chat on WhatsApp"
            >
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="contact-icon"
                >
                    <path
                        fill="currentColor"
                        d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.5 0 .1 5.4.1 12c0 2.1.6 4.2 1.7 6L0 24l6.2-1.6a12 12 0 0 0 5.9 1.5h.1c6.6 0 12-5.4 12-12a11.9 11.9 0 0 0-3.7-8.4ZM12.1 21.9a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.3-.4a9.8 9.8 0 1 1 8.4 4.6Zm5.4-7.4c-.3-.2-1.7-.9-2-.9s-.5-.2-.7.2c-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.5-1.7-1.7-2-.2-.3 0-.5.1-.7l.5-.5.3-.5c.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.2-.6-.5-.5-.7-.5H7.7c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.8 4.3.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.1-.2-.2-.5-.3Z"
                    />
                </svg>
                <span>WhatsApp</span>
            </a>

            {/* Call button */}
            <a
                className="floating-contact-btn call-btn"
                href="tel:+919444912126"
                aria-label="Call Makkal Marunthagam"
                title="Call us"
            >
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="contact-icon"
                >
                    <path
                        fill="currentColor"
                        d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2 11 11 0 0 0 3.4.5 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17.8 17.8 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11 11 0 0 0 .5 3.4 1 1 0 0 1-.2 1Z"
                    />
                </svg>
                <span>Call Us</span>
            </a>
        </div>
    );
}

export default FloatingContact;
