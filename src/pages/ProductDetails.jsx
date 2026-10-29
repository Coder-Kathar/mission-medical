import { useParams, Link } from "react-router-dom";
import products from "../data/products";
import "./ProductDetails.css";
import { useState, useContext } from "react";
import { RequestContext } from "../context/RequestContext";

function ProductDetails() {
    const [quantity, setQuantity] = useState(1);
    const [quantityType, setQuantityType] = useState("tablet");

    const { id } = useParams();
    const { addToRequest } = useContext(RequestContext);

    const product = products.find(
        (product) => product.id === Number(id)
    );

    if (!product) {
        return (
            <main className="product-not-found">
                <h1>Product Not Found</h1>
                <p>The product you are looking for does not exist.</p>
                <Link to="/products" className="back-link">
                    ← Back to Products
                </Link>
            </main>
        );
    }

    const isTabletProduct = product.quantityType === "tablet";
    const selectedType = isTabletProduct
        ? quantityType
        : product.quantityType;

    const totalTablets =
        quantityType === "strip" && isTabletProduct
            ? quantity * (product.tabletsPerStrip || 1)
            : quantity;

    return (
        <main className="product-details">
            <Link to="/products" className="back-link">
                <span>←</span> Back to Products
            </Link>

            <div className="product-details-image-wrapper">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-details-image"
                />
            </div>

            <div className="product-details-info">
                <h1>{product.name}</h1>

                <p className="product-description">
                    {product.description}
                </p>

                <p>
                    <strong>Usage:</strong> {product.usage}
                </p>

                <p className="quantity-type-label">
                    <strong>Quantity Type:</strong>{" "}
                    {selectedType === "tablet"
                        ? "Tablets"
                        : selectedType === "strip"
                        ? "Strips"
                        : "Pieces"}
                </p>

                {isTabletProduct && (
                    <div
                        className="quantity-type-selection"
                        aria-label="Choose quantity type"
                    >
                        <button
                            type="button"
                            className={
                                quantityType === "tablet" ? "selected" : ""
                            }
                            aria-pressed={quantityType === "tablet"}
                            onClick={() => setQuantityType("tablet")}
                        >
                            Tablets
                        </button>

                        <button
                            type="button"
                            className={
                                quantityType === "strip" ? "selected" : ""
                            }
                            aria-pressed={quantityType === "strip"}
                            onClick={() => setQuantityType("strip")}
                        >
                            Strips
                        </button>
                    </div>
                )}

                <div className="quantity-controls">
                    <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={quantity <= 1}
                        onClick={() =>
                            setQuantity((previous) =>
                                Math.max(1, previous - 1)
                            )
                        }
                    >
                        −
                    </button>

                    <span>{quantity}</span>

                    <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() =>
                            setQuantity((previous) => previous + 1)
                        }
                    >
                        +
                    </button>
                </div>

                {isTabletProduct && (
                    <p className="total-tablets">
                        <strong>
                            {quantityType === "strip"
                                ? "Total Tablets:"
                                : "Total Tablets:"}
                        </strong>{" "}
                        {totalTablets}
                    </p>
                )}

                <button
                    type="button"
                    className="request-button"
                    onClick={() =>
                        addToRequest(product, quantity, quantityType)
                    }
                >
                    Add to Request
                </button>

                <Link to="/request" className="view-request-link">
                    View Request <span>→</span>
                </Link>
            </div>
        </main>
    );
}

export default ProductDetails;