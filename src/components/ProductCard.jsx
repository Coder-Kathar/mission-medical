import "./ProductCard.css";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { RequestContext } from "../context/RequestContext";

function ProductCard({ id, name, description, image, ...productDetails }) {
    const { addToRequest } = useContext(RequestContext);
    const [isRequested, setIsRequested] = useState(false);

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
            productDetails.quantityType || "piece"
        );

        setIsRequested(true);
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
                onClick={handleRequest}
                className={isRequested ? "requested-button" : ""}
            >
                Request Product
            </button>
        </div>
    );
}

export default ProductCard;