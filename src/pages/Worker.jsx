import { useState } from "react";
import ScrollReveal from "../components/ScrollReveal";
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

function getOrderStatus(order) {
    return (order.status || "Pending").toLowerCase() === "delivered"
        ? "Delivered"
        : "Pending";
}

function getCustomerCity(order) {
    return order.city?.trim() || "N/A";
}

function getContactNumber(order) {
    return (
        order.mobileNumber ||
        order.contactNumber ||
        order.phoneNumber ||
        order.phone ||
        "N/A"
    );
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
        if (!selectedOrder || getOrderStatus(selectedOrder) !== "Pending") {
            return;
        }

        const updatedOrders = orders.map((item) =>
            String(item.id) === String(selectedOrder.id)
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
                getOrderStatus(order) === filterStatus;

            return matchesDate && matchesStatus;
        })
        .sort((a, b) => getOrderDate(b) - getOrderDate(a));

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

        return date ? date.toLocaleString("en-IN") : "N/A";
    };

    // Get products from the order
    const requestedProducts =
        selectedOrder?.requestItems ||
        selectedOrder?.items ||
        [];

    return (
        <main className="worker-page">

            {/* Worker Page Heading */}
            <ScrollReveal>
                <h1>Worker Portal</h1>
                <p>Search orders or manage daily customer requests.</p>
            </ScrollReveal>

            {/* Order ID Search and Date Picker */}
            <ScrollReveal delay={0.1}>
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
            </ScrollReveal>

            {/* Daily Orders Table */}
            <ScrollReveal delay={0.15}>
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
                                            <th>Customer Name</th>
                                            <th>Contact Number</th>
                                            <th>City</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {currentOrders.map((order) => (
                                            <tr key={order.id}>
                                                <td>
                                                    {order.customerName || "N/A"}
                                                </td>

                                                <td>
                                                    {getContactNumber(order)}
                                                </td>

                                                <td>
                                                    {getCustomerCity(order)}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`worker-status-badge ${
                                                            getOrderStatus(order) === "Delivered"
                                                                ? "delivered"
                                                                : "pending"
                                                        }`}
                                                    >
                                                        {getOrderStatus(order)}
                                                    </span>
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className="worker-view-button"
                                                        onClick={() =>
                                                            setSelectedOrder(order)
                                                        }
                                                    >
                                                        View Request
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
            </ScrollReveal>

            {/* View Request Modal - No Scroll Reveal */}
            {selectedOrder && (
                <div
                    className="worker-modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setSelectedOrder(null);
                        }
                    }}
                >
                    <div
                        className="worker-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="worker-modal-title"
                    >
                        <h2 id="worker-modal-title">Customer Request</h2>

                        <p>
                            <strong>Order ID:</strong> {selectedOrder.id}
                        </p>

                        <p>
                            <strong>Customer:</strong>{" "}
                            {selectedOrder.customerName || "N/A"}
                        </p>

                        <p>
                            <strong>Contact Number:</strong>{" "}
                            {getContactNumber(selectedOrder)}
                        </p>

                        <p>
                            <strong>City:</strong>{" "}
                            {getCustomerCity(selectedOrder)}
                        </p>

                        <p>
                            <strong>Address:</strong>{" "}
                            {typeof selectedOrder.deliveryAddress === "string"
                                ? selectedOrder.deliveryAddress
                                : selectedOrder.deliveryAddress?.address || "N/A"}
                        </p>

                        <p>
                            <strong>Order Date:</strong>{" "}
                            {formatTimestamp(selectedOrder)}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            <span
                                className={`worker-status-badge ${
                                    getOrderStatus(selectedOrder) === "Delivered"
                                        ? "delivered"
                                        : "pending"
                                }`}
                            >
                                {getOrderStatus(selectedOrder)}
                            </span>
                        </p>

                        <h3>Requested Products</h3>

                        {requestedProducts.length > 0 ? (
                            requestedProducts.map((item, index) => (
                                <div
                                    className="worker-order-item"
                                    key={item.id || index}
                                >
                                    <strong>
                                        {item.name ||
                                            item.productName ||
                                            "Product"}
                                    </strong>

                                    <p>
                                        Quantity: {item.quantity ?? 1}{" "}
                                        {item.quantityType || "pieces"}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>No product details available.</p>
                        )}

                        <div className="worker-modal-actions">
                            {getOrderStatus(selectedOrder) === "Pending" && (
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
