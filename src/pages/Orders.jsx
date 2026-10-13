import "./Orders.css";

function Orders() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    return (
        <main className="orders-page">
            <h1>My Requests</h1>

            {orders.length === 0 ? (
                <p>No requests found.</p>
            ) : (
                orders.map((order) => (
                    <div className="order-card" key={order.id}>
                        <p>Order ID: {order.id}</p>
                        <p>Request Date: {order.date}</p>
                        <h2>Status: {order.status}</h2>

                        <h3>Requested Products</h3>
                        {(order.requestItems || order.products || []).map((item, index) => (
                            <div className="order-product" key={index}>
                                <p>
                                    {item.name} — {item.quantity} {item.quantityType || "pieces"}
                                </p>
                                {item.quantityType === "strip" && (
                                    <p>
                                        Total tablets: {item.quantity * item.tabletsPerStrip}
                                    </p>
                                )}
                            </div>
                        ))}

                        <div className="delivery-info">
                            <h3>Delivery Details</h3>
                            <p>{order.customerName || order.name}</p>
                            <p>{order.mobileNumber || order.phone}</p>
                            <p>{order.deliveryAddress || order.address}</p>
                        </div>
                    </div>
                ))
            )}
        </main>
    );
}

export default Orders;