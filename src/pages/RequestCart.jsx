import { useContext } from "react";
import { Link } from "react-router-dom";
import { RequestContext } from "../context/RequestContext";
import "./RequestCart.css";

function RequestCart() {
    const {
        requestItems,
        removeFromRequest,
        updateRequestQuantity,
        setRequestItems,
    } = useContext(RequestContext);

    const changeQuantityType = (index, quantityType) => {
        setRequestItems((items) =>
            items.map((item, i) =>
                i === index ? { ...item, quantityType } : item
            )
        );
    };

    return (
        <main className="request-page">
            <h1>Request</h1>

            <div className="request-actions">
                <Link to="/products" className="continue-browsing">
                    + Add More Products
                </Link>

                {requestItems.length > 0 && (
                    <Link to="/request-preview" className="continue-browsing">
                        Review Request →
                    </Link>
                )}
            </div>

            {requestItems.length === 0 ? (
                <p>No products added to your request.</p>
            ) : (
                <div>
                    {requestItems.map((item, index) => {
                        const isMedicine = [
                            "medicines",
                            "drug",
                            "vitamins",
                        ].includes(item.category);

                        const tabletsPerStrip = item.tabletsPerStrip || 10;

                        return (
                            <div className="request-item" key={item.id}>
                                <h3>{item.name}</h3>

                                {isMedicine ? (
                                    <>
                                        <label>
                                            Quantity Type:{" "}
                                            <select
                                                value={item.quantityType || "tablet"}
                                                onChange={(e) =>
                                                    changeQuantityType(
                                                        index,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="tablet">
                                                    Tablets
                                                </option>
                                                <option value="strip">
                                                    Strips
                                                </option>
                                            </select>
                                        </label>

                                        <p>
                                            Quantity: {item.quantity}{" "}
                                            {item.quantityType === "strip"
                                                ? "strip(s)"
                                                : "tablet(s)"}
                                        </p>

                                        {item.quantityType === "strip" && (
                                            <p>
                                                Total Tablets:{" "}
                                                {item.quantity * tabletsPerStrip}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p>
                                        Quantity: {item.quantity} piece(s)
                                    </p>
                                )}

                                <div className="quantity-controls">
                                    <button
                                        onClick={() =>
                                            updateRequestQuantity(
                                                index,
                                                item.quantity - 1
                                            )
                                        }
                                        disabled={item.quantity <= 1}
                                    >
                                        <strong>-</strong>
                                    </button>

                                    <span>{item.quantity}</span>

                                    <button
                                        onClick={() =>
                                            updateRequestQuantity(
                                                index,
                                                item.quantity + 1
                                            )
                                        }
                                    >
                                        <strong>+</strong>
                                    </button>
                                </div>

                                <button
                                    className="remove-button"
                                    onClick={() => removeFromRequest(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}

export default RequestCart;
