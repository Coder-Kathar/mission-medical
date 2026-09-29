import "./Orders.css";

function Orders(){

    const orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    const cancelOrder = (orderId) => {

        const updatedOrders = orders.map((order) => 
            order.id === orderId
                ? {...order, status: "Cancelled"}
                : order
        );

        localStorage.setItem("orders", JSON.stringify(updatedOrders));

        window.location.reload();
    };

    return (
        <main className="orders-page">

            <h1>My Orders</h1>

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order) => (

                    <div className="order-card" key={order.id}>

                        <p>Order ID: {order.id}</p>
                        <p>Order Date: {order.date}</p>

                        <h2>
                            {order.status === "Cancelled"
                            ? "Order Cancelled"
                            : "Order Placed Successfully"}</h2>

                        {order.products.map((product) => (
                            <div key={product.id} className="order-product">
                                <h3>{product.name}</h3>

                                <p>
                                    ₹{product.price} × {product.quantity}
                                </p>
                            </div>
                        ))}

                        <div className="order-total">
                            <h2>
                                Total: ₹{order.total}
                            </h2>
                        </div>

                        <div className="delivery-info">

                            <h3>Delivery Address</h3>
                            <p>{order.name}</p>
                            <p>{order.phone}</p>
                            <p>{order.address}</p>
                            <p>
                                {order.city} - {order.pincode}
                            </p>
                            <p>
                                Status: {order.status}
                            </p>

                            {order.status === "Order Placed" && (
                                <button onClick={() => cancelOrder(order.id)}>
                                    Cancel Order
                                </button>
                            )}
                        </div>

                    </div>
                ))
            )}
        </main>
    );
}

export default Orders;