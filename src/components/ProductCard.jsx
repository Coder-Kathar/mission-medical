import "./ProductCard.css";
import { useContext } from "react";
import { RequestContext } from "../context/RequestContext";

function ProductCard({ id, name, description, image, ...productDetails }) {
    const { addToRequest } = useContext(RequestContext);

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
    };

    return (
        <div className="product-card">
            <img
                src={image}
                alt={name}
                className="product-image"
            />

            <h3>{name}</h3>
            <p>{description}</p>

            <button onClick={handleRequest}>
                Request Product
            </button>
        </div>
    );
}

export default ProductCard;