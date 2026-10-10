import { useState } from "react";
import "./Worker.css";

function Worker(){

    const [orderId, setOrderId] = useState("");
    const [order, setOrder] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();

        if(!orderId.trim()){
            alert("Please enter an Order ID.");
            return;
        }

        setOrder({
            orderId,
            customerName: "Test Customer",
            mobileNumber: "9876543210",
            deliveryAddress: "Salem, Tamil Nadu",
            status: "Pending"
        });
    };

    return (
        <main className="worker-page">
            <h1>Worker Portal</h1>
            <p>Update order delivery status using the order ID.</p>

            <form onSubmit={handleSearch}>
                <input 
                    type="text"
                    placeholder="Enter Order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required />

                <button type="submit">Find Order</button>
            </form>

            {order && (
                <div className="worker-order">
                    <h2>Order Details</h2>
                    <p>Order ID: {order.orderId}</p>
                    <p>Customer: {order.customerName}</p>
                    <p>Mobile: {order.mobileNumber}</p>
                    <p>Address: {order.deliveryAddress}</p>
                    <p>Status: {order.status}</p>
                    {order.status === "Pending" && (
                        <button 
                            type="button"
                            onClick={() => setOrder({...order, status: "Delivered"})}>
                                Mark as Delivered
                        </button>        
                    )}
                </div>
            )}

            
        </main>
    );
}

export default Worker;