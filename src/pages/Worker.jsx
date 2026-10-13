import { useState } from "react";
import "./Worker.css";

function Worker() {
    const [orderId, setOrderId] = useState("");
    const [order, setOrder] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();

        if (!orderId.trim()) {
            alert("Please enter an Order ID.");
            return;
        }

        const orders = JSON.parse(
            localStorage.getItem("orders") || "[]"
        );

        const foundOrder = orders.find(
            (item) => item.id === orderId.trim()
        );

        if (!foundOrder) {
            setOrder(null);
            alert("Order not found. Please check the Order ID.");
            return;
        }

        setOrder(foundOrder);
    };

    const handleMarkDelivered = () => {
        const orders = JSON.parse(
            localStorage.getItem("orders") || "[]"
        );

        const updatedOrders = orders.map((item) =>
            item.id === order.id
                ? { ...item, status: "Delivered" }
                : item
        );

        localStorage.setItem("orders", JSON.stringify(updatedOrders));

        setOrder({ ...order, status: "Delivered" });
        alert("Order marked as Delivered.");
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
                    required
                />
                <button type="submit">Find Order</button>
            </form>

            {order && (
                <div className="worker-order">
                    <h2>Order Details</h2>
                    <p>Order ID: {order.id}</p>
                    <p>Customer: {order.customerName}</p>
                    <p>Mobile: {order.mobileNumber}</p>
                    <p>Address: {order.deliveryAddress}</p>
                    <p>Status: {order.status}</p>

                    {order.status === "Pending" && (
                        <button
                            type="button"
                            onClick={handleMarkDelivered}
                        >
                            Mark as Delivered
                        </button>
                    )}
                </div>
            )}
        </main>
    );
}

export default Worker;
