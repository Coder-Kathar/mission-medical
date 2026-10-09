import { useContext } from "react";
import { Link } from "react-router-dom";
import { RequestContext } from "../context/RequestContext";
import "./RequestCart.css";

function RequestCart(){

    const { requestItems,
            removeFromRequest,
            updateRequestQuantity} = useContext(RequestContext);

    return (
        <main className="request-page">
            <h1>Request</h1>

            <Link
                to="/products" className="continue-browsing">
                + Add More Products</Link>

            {requestItems.length > 0 && (
                <Link
                    to="/request-preview" className="continue-browsing"
                >Review Request →</Link>
            )}

            {requestItems.length === 0 ? (
                <p>No products added to your request.</p>
            ) : (
                <div>
                    {requestItems.map((item, index) => (
                        <div className="request-item" key={index}>
                            <h3>{item.name}</h3>

                            <p>
                                Quantity Type: {item.quantityType}
                            </p>

                            <div className="quantity-controls">
                                <button
                                    onClick={() => updateRequestQuantity(index, item.quantity - 1)}
                                    disabled={item.quantity <= 1}>
                                    -
                                </button>

                                <span>{item.quantity}</span>

                                <button
                                    onClick={() => updateRequestQuantity(index, item.quantity + 1)}>
                                    +
                                </button>
                            </div>

                            {item.quantityType === "strip" && (
                                <p>
                                    Total Tablets: {item.quantity * item.tabletsPerStrip}
                                </p>
                            )}

                            <button
                                className="remove-button" 
                                onClick={() => removeFromRequest(index)}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default RequestCart;