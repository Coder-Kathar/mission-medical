import { useContext } from "react";
import { RequestContext } from "../context/RequestContext";

function RequestCart(){

    const {requestItems, removeFromRequest} = useContext(RequestContext);

    return (
        <main>
            <h1>Request</h1>

            {requestItems.length === 0 ? (
                <p>No products added to your request.</p>
            ) : (
                <div>
                    {requestItems.map((item, index) => (
                        <div key={index}>
                            <h3>{item.name}</h3>

                            <p>
                                Quantity Type: {item.quantityType}
                            </p>

                            <p>
                                Quantity: {item.quantity}
                            </p>

                            <button onClick={() => removeFromRequest(index)}>
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