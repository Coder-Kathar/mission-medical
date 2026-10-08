import { useParams, Link } from "react-router-dom";
import products from "../data/products";
import "./ProductDetails.css";
import { useState, useContext } from "react";
import { RequestContext } from "../context/RequestContext";

function ProductDetails(){

    const [quantity, setQuantity] = useState(1);
    const [quantityType, setQuantityType] = useState("tablet");

    const {id} = useParams();

    const {addToRequest} = useContext(RequestContext);

    const product = products.find(
        (product) => product.id === Number(id)
    );

    if(!product){
        return (
            <main>
                <h1>Product Not Found</h1>
                <p>The product you are looking for does not exist.</p>
            </main>
        );
    }
    return (
        <main className="product-details">

            <Link to="/products" className="back-link">
                ← Back to Products
            </Link>

            <img src={product.image} alt={product.name} className="product-details-image"/>

            <div className="product-details-info">

                <h1>{product.name}</h1>
                <p>{product.description}</p>

                <p>
                    <strong>Usage:</strong> {product.usage}
                </p>

                <p>
                    <strong>Quantity Type:</strong>{" "}
                    {product.quantityType === "tablet" ? "Tablets" : "Pieces"}
                </p>

                {product.quantityType === "tablet" && (
                    <div className="quantity-type-selection">
                        <button
                            className={quantityType === "tablet" ? "selected" : ""}
                            onClick={() => setQuantityType("tablet")}
                        >
                            Tablets
                        </button>

                        <button
                            className={quantityType === "strip" ? "selected" : ""}
                            onClick={() => setQuantityType("strip")}
                        >
                            Strips
                        </button>
                    </div>
                )}

                <div className="quantity-controls">

                    <button onClick={() => {
                        if(quantity > 1){
                            setQuantity(quantity - 1);
                        }
                    }}>-</button>

                    <span>{quantity}</span>

                    <button onClick={() => setQuantity(quantity + 1)}>+</button>

                </div>

                {product.quantityType === "tablet" && (
                    <p>
                        <strong>Total Tablets:</strong>{" "}
                        {quantityType === "strip"
                            ? quantity * product.tabletsPerStrip
                            : quantity}
                    </p>
                )}

                <button 
                    className="request-button"
                    onClick={() => 
                        addToRequest(product, quantity, quantityType)
                    }>
                    Add to Request
                </button>

                <Link to="/request" className="view-request-link">
                    View Request
                </Link>

            </div>
        </main>
    );
}

export default ProductDetails;