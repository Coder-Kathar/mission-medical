import { useState, useEffect } from "react";
import "./OfferSlider.css";

function OfferSlider() {
    const [offers] = useState(() => {
        try {
            const savedOffers =
                JSON.parse(localStorage.getItem("medicalOffers")) || [];

            return savedOffers.filter((offer) => offer.published);
        } catch {
            return [];
        }
    });

    const [currentIndex, setCurrentIndex] = useState(0);

    // Automatically change offers every 4 seconds
    useEffect(() => {
        if (offers.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((previousIndex) =>
                (previousIndex + 1) % offers.length
            );
        }, 2500);

        return () => clearInterval(interval);
    }, [offers.length]);

    if (offers.length === 0) {
        return null;
    }

    const currentOffer = offers[currentIndex];

    // Previous offer
    const showPrevious = () => {
        setCurrentIndex((previousIndex) =>
            previousIndex === 0
                ? offers.length - 1
                : previousIndex - 1
        );
    };

    // Next offer
    const showNext = () => {
        setCurrentIndex((previousIndex) =>
            (previousIndex + 1) % offers.length
        );
    };

    return (
        <section className="offer-slider">
            <div className="offer-slide">

                {currentOffer.type !== "text-only" && (
                    <div className="offer-slide-image">
                        <img
                            src={currentOffer.image}
                            alt={currentOffer.title || "Promotional offer"}
                        />
                    </div>
                )}

                {currentOffer.type !== "image-only" && (
                    <div className="offer-slide-content">
                        <h2>{currentOffer.title}</h2>
                        <p>{currentOffer.description}</p>
                    </div>
                )}

            </div>

            {offers.length > 1 && (
                <div className="offer-slider-controls">
                    <button
                        onClick={showPrevious}
                        aria-label="Previous offer"
                    >
                        ❮
                    </button>

                    <span>
                        {currentIndex + 1} / {offers.length}
                    </span>

                    <button
                        onClick={showNext}
                        aria-label="Next offer"
                    >
                        ❯
                    </button>
                </div>
            )}
        </section>
    );
}

export default OfferSlider;
