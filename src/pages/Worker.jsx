import { useState } from "react";
import "./Worker.css";

function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getOrderDate(order) {
    const value = order.createdAt || order.date;

    if (!value) return null;

    const parsedDate = new Date(value);

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function Worker() {
    const [orders, setOrders] = useState(() =>
        JSON.parse(localStorage.getItem("orders") || "[]")
    );

    const [orderId, setOrderId] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [selectedDate, setSelectedDate] = useState(() =>
        getLocalDateString(new Date())
    );

    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const ordersPerPage = 10;

    // Search for a specific order by ID
    const handleSearch = (e) => {
        e.preventDefault();

        const foundOrder = orders.find(
            (item) => String(item.id) === orderId.trim()
        );

        if (!foundOrder) {
            alert("Order not found. Please check the Order ID.");
            return;
        }

        setSelectedOrder(foundOrder);
    };

    // Update an order's status to Delivered
    const handleMarkDelivered = () => {
        const updatedOrders = orders.map((item) =>
            item.id === selectedOrder.id
                ? { ...item, status: "Delivered" }
                : item
        );

        localStorage.setItem("orders", JSON.stringify(updatedOrders));

        setOrders(updatedOrders);

        setSelectedOrder((previousOrder) => ({
            ...previousOrder,
            status: "Delivered",
        }));

        alert("Order marked as Delivered.");
    };

    // Filter orders by selected date and status
    const filteredOrders = orders
        .filter((order) => {
            const orderDate = getOrderDate(order);

            if (!orderDate) return false;

            const matchesDate =
                getLocalDateString(orderDate) === selectedDate;

            const matchesStatus =
                filterStatus === "all" ||
                (order.status || "Pending") === filterStatus;

            return matchesDate && matchesStatus;
        })
        .sort((a, b) => {
            return getOrderDate(b) - getOrderDate(a);
        });

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;

    const currentOrders = filteredOrders.slice(
        startIndex,
        startIndex + ordersPerPage
    );

    // Format timestamp for display
    const formatTimestamp = (order) => {
        const date = getOrderDate(order);

        return date
            ? date.toLocaleString("en-IN")
            : "N/A";
    };

    return (
        <main className="worker-page">
            <h1>Worker Portal</h1>
            <p>Search orders or manage daily customer requests.</p>

            {/* Order ID Search and Date Picker */}
            <div className="worker-toolbar">
                <form onSubmit={handleSearch} className="worker-search-form">
                    <input
                        type="text"
                        placeholder="Enter Order ID"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="worker-search-button"
                        aria-label="Search order"
                        title="Search order"
                    >
                        🔍
                    </button>
                </form>

                <label className="worker-date-picker">
                    <span className="calendar-icon">📅</span>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setCurrentPage(1);
                        }}
                        aria-label="Select order date"
                    />
                </label>
            </div>

            {/* Daily Orders Table */}
            <section className="worker-orders-section">
                <div className="worker-orders-header">
                    <h2>Daily Customer Orders</h2>

                    <select
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                        aria-label="Filter orders by status"
                    >
                        <option value="all">All Orders</option>
                        <option value="Pending">Pending Orders</option>
                        <option value="Delivered">Delivered Orders</option>
                    </select>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="worker-empty-orders">
                        <h3>No orders found</h3>
                        <p>
                            No orders are available for the selected date
                            and status.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="worker-table-wrapper">
                            <table className="worker-orders-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Timestamp</th>
                                        <th>Customer Name</th>
                                        <th>View Details</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{formatTimestamp(order)}</td>
                                            <td>
                                                {order.customerName || "N/A"}
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="worker-view-button"
                                                    onClick={() =>
                                                        setSelectedOrder(order)
                                                    }
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="worker-pagination">
                            <span>
                                Showing {startIndex + 1}–
                                {Math.min(
                                    startIndex + ordersPerPage,
                                    filteredOrders.length
                                )}{" "}
                                of {filteredOrders.length} orders
                            </span>

                            <div className="worker-pagination-actions">
                                <button
                                    type="button"
                                    disabled={currentPage <= 1}
                                    onClick={() =>
                                        setCurrentPage((page) => page - 1)
                                    }
                                >
                                    Previous
                                </button>

                                <span>
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    type="button"
                                    disabled={currentPage >= totalPages}
                                    onClick={() =>
                                        setCurrentPage((page) => page + 1)
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </section>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="worker-modal-overlay">
                    <div className="worker-modal">
                        <h2>Order Details</h2>

                        <p>
                            <strong>Order ID:</strong> {selectedOrder.id}
                        </p>
                        <p>
                            <strong>Customer:</strong>{" "}
                            {selectedOrder.customerName || "N/A"}
                        </p>
                        <p>
                            <strong>Mobile:</strong>{" "}
                            {selectedOrder.mobileNumber || "N/A"}
                        </p>
                        <p>
                            <strong>Address:</strong>{" "}
                            {selectedOrder.deliveryAddress || "N/A"}
                        </p>
                        <p>
                            <strong>Timestamp:</strong>{" "}
                            {formatTimestamp(selectedOrder)}
                        </p>
                        <p>
                            <strong>Status:</strong>{" "}
                            {selectedOrder.status || "Pending"}
                        </p>

                        <h3>Requested Products</h3>

                        {(selectedOrder.requestItems ||
                            selectedOrder.items ||
                            []).map((item, index) => (
                            <p className="worker-order-item" key={item.id || index}>
                                <strong>
                                    {item.name || item.productName || "Product"}
                                </strong>
                                {" — Quantity: "}
                                {item.quantity}
                                {" "}
                                {item.quantityType || "pieces"}
                            </p>
                        ))}

                        <div className="worker-modal-actions">
                            {(selectedOrder.status || "Pending") === "Pending" && (
                                <button
                                    type="button"
                                    onClick={handleMarkDelivered}
                                >
                                    Mark as Delivered
                                </button>
                            )}

                            <button
                                type="button"
                                className="worker-close-button"
                                onClick={() => setSelectedOrder(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Worker;