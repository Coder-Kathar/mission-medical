import "./Orders.css";
import { useState } from "react";

function AdminOrders() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const [filter, setFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    const filteredOrders = orders.filter((order) => {
        const matchesStatus =
            filter === "All" || order.status === filter;

        const matchesOrderId = String(order.id ?? "")
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase());

        return matchesStatus && matchesOrderId;
    });

    const totalPages = Math.ceil(
        filteredOrders.length / ordersPerPage
    );

    const startIndex = (currentPage - 1) * ordersPerPage;

    const currentOrders = filteredOrders.slice(
        startIndex,
        startIndex + ordersPerPage
    );

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order) => order.status === "Pending"
    ).length;

    const deliveredOrders = orders.filter(
        (order) => order.status === "Delivered"
    ).length;

    return (
        <main className="orders-page">
            <h1>Admin — All Requests</h1>

            <div className="admin-summary">
                <div className="summary-card">
                    <h3>Total Requests</h3>
                    <p>{totalOrders}</p>
                </div>

                <div className="summary-card">
                    <h3>Pending Requests</h3>
                    <p>{pendingOrders}</p>
                </div>

                <div className="summary-card">
                    <h3>Delivered Requests</h3>
                    <p>{deliveredOrders}</p>
                </div>
            </div>

            <div className="admin-order-controls">
                
                <input
                    type="text"
                    placeholder="Search by Order ID..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                <select
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="All">All Requests</option>
                    <option value="Pending">Pending</option>
                    <option value="Delivered">Delivered</option>
                </select>

            </div>

            {filteredOrders.length === 0 ? (
                <div className="empty-orders">
                    <h3>No requests found</h3>
                    <p>Try changing your search or status filter.</p>
                </div>
            ) : (
                currentOrders.map((order) => (
                    <div className="order-card" key={order.id}>
                        <div className="order-card-header">
                            <h2>Order ID: {order.id}</h2>

                            <select
                                value={order.status}
                                onChange={(e) => {
                                    const newStatus = e.target.value;

                                    if (
                                        newStatus === "Delivered" &&
                                        !window.confirm("Are you sure you want to mark this request as Delivered?")
                                    ) {
                                        return;
                                    }

                                    const updatedOrders = orders.map((item) =>
                                        item.id === order.id
                                            ? { ...item, status: newStatus }
                                            : item
                                    );

                                    localStorage.setItem("orders", JSON.stringify(updatedOrders));
                                    window.location.reload();
                                }}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Delivered">Delivered</option>
                            </select>

                        </div>
                        <p>Customer: {order.customerName}</p>
                        <p>Mobile: {order.mobileNumber}</p>
                        <p>Address: {order.deliveryAddress}</p>
                        <p>Date: {order.date}</p>
                        {order.prescriptionName && (
                            <p>
                                Prescription: {order.prescriptionName || "Not attached"}
                            </p>
                        )}
                        <p>Status: {order.status}</p>


                        <h3>Requested Products</h3>

                        <p>
                            Total Items: {order.requestItems.reduce(
                                (total, item) => total + Number(item.quantity || 0),
                                0
                            )}
                        </p>

                        {order.requestItems.map((item, index) => (
                            <p key={index}>
                                {item.name} — {item.quantity}{" "}
                                {item.quantityType || "pieces"}
                            </p>
                        ))}
                    </div>
                ))
            )}

            {filteredOrders.length > 0 && (
                <div className="pagination">
                    <button
                        disabled={currentPage === 1}
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
                        disabled={currentPage >= totalPages}
                        onClick={() =>
                            setCurrentPage((page) => page + 1)
                        }
                    >
                        Next
                    </button>
                </div>
            )}
        </main>
    );
}

export default AdminOrders;