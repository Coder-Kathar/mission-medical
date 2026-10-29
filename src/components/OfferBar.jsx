import "./OfferBar.css";

const offers = [
    "🎉 SPECIAL OFFERS",
    "💚 DISCOUNTS FROM 30% TO 90%",
    "💊 QUALITY HEALTHCARE PRODUCTS",
    "🛒 SHOP YOUR ESSENTIALS"
];

function OfferBar() {
    return (
        <div className="offer-bar" aria-label="Special offers">
            <div className="offer-track">
                {[0, 1].map((group) => (
                    <div
                        className="offer-group"
                        key={group}
                        aria-hidden={group === 1}
                    >
                        {offers.map((offer, index) => (
                            <span className="offer-item" key={index}>
                                {offer}
                                <span className="offer-separator">✦</span>
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OfferBar;