import "./ProductCard.css";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { RequestContext } from "../context/RequestContext";
import "../RequestButton.css";

function ProductCard({ id, name, description, image, ...productDetails }) {
    const { requestItems, addToRequest } = useContext(RequestContext);

    const quantityType = productDetails.quantityType || "piece";

    const isAlreadyRequested = requestItems.some(
        (item) =>
            item.id === id &&
            item.quantityType === quantityType
    );

    const handleRequest = () => {
        addToRequest(
            {
                ...productDetails,
                id,
                name,
                description,
                image,
            },
            1,
            quantityType
        );
    };

    return (
        <div className="product-card">
            <Link
                to={`/products/${id}`}
                aria-label={`View details for ${name}`}
            >
                <img
                    src={image}
                    alt={name}
                    className="product-image"
                />
                <h3>{name}</h3>
            </Link>

            <p>{description}</p>

            <button
                type="button"
                onClick={handleRequest}
                className={`request-button ${
                    isAlreadyRequested ? "added" : ""
                }`}
            >
                {isAlreadyRequested
                    ? "✓ Added to Request"
                    : "Request Product"}
            </button>
        </div>
    );
}

export default ProductCard;