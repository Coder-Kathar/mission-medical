import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RequestContext } from "../context/RequestContext";
import "./Orders.css";

const ORDERS_PER_PAGE = 30;

function Orders() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const { addToRequest } = useContext(RequestContext);
    const navigate = useNavigate();

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [dateMode, setDateMode] = useState("single");
    const [selectedDate, setSelectedDate] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Re-Order functionality
    const handleReOrder = (order) => {
        const previousItems =
            order.requestItems || order.products || [];

        if (previousItems.length === 0) {
            alert("No products found in this request.");
            return;
        }

        previousItems.forEach((item) => {
            addToRequest(
                item,
                item.quantity,
                item.quantityType
            );
        });

        navigate("/request");
    };

    // Supports both new ISO dates and older locale-formatted dates.
    const getOrderDate = (date) => {
        if (!date) return null;

        let parsedDate = new Date(date);

        if (!Number.isNaN(parsedDate.getTime())) {
            return parsedDate;
        }

        const match = date.match(
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})/
        );

        if (match) {
            const [, day, month, year] = match;

            parsedDate = new Date(
                Number(year),
                Number(month) - 1,
                Number(day)
            );

            return parsedDate;
        }

        return null;
    };

    const getDateKey = (date) => {
        if (!date) return "";

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const formatOrderDate = (date) => {
        const parsedDate = getOrderDate(date);

        if (!parsedDate) return date || "N/A";

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Newest orders first.
    const sortedOrders = [...orders].sort((a, b) => {
        const dateA = getOrderDate(a.date)?.getTime() || 0;
        const dateB = getOrderDate(b.date)?.getTime() || 0;

        return dateB - dateA;
    });

    // Apply date and status filters together.
    const filteredOrders = sortedOrders.filter((order) => {
        const orderDate = getOrderDate(order.date);
        const orderDateKey = orderDate
            ? getDateKey(orderDate)
            : "";

        let matchesDate = true;

        if (dateMode === "single" && selectedDate) {
            matchesDate = orderDateKey === selectedDate;
        }

        if (dateMode === "range") {
            if (fromDate) {
                matchesDate =
                    matchesDate && orderDateKey >= fromDate;
            }

            if (toDate) {
                matchesDate =
                    matchesDate && orderDateKey <= toDate;
            }
        }

        const matchesStatus =
            statusFilter === "all" ||
            (order.status || "Pending").toLowerCase() === statusFilter;

        return matchesDate && matchesStatus;
    });

    const totalPages = Math.ceil(
        filteredOrders.length / ORDERS_PER_PAGE
    );

    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;

    const currentOrders = filteredOrders.slice(
        startIndex,
        startIndex + ORDERS_PER_PAGE
    );

    const resetPage = (callback) => {
        callback();
        setCurrentPage(1);
    };

    return (
        <main className="orders-page">
            <h1>My Requests</h1>

            {orders.length > 0 && (
                <div className="customer-order-filters">
                    <div className="filter-group">
                        <label htmlFor="dateMode">Date Filter</label>

                        <select
                            id="dateMode"
                            value={dateMode}
                            onChange={(e) => {
                                setDateMode(e.target.value);
                                setSelectedDate("");
                                setFromDate("");
                                setToDate("");
                                setCurrentPage(1);
                            }}
                        >
                            <option value="single">Single Date</option>
                            <option value="range">Date Range</option>
                        </select>
                    </div>

                    {dateMode === "single" ? (
                        <div className="filter-group">
                            <label htmlFor="selectedDate">
                                Select Date
                            </label>

                            <input
                                type="date"
                                id="selectedDate"
                                value={selectedDate}
                                onChange={(e) =>
                                    resetPage(() =>
                                        setSelectedDate(e.target.value)
                                    )
                                }
                            />
                        </div>
                    ) : (
                        <>
                            <div className="filter-group">
                                <label htmlFor="fromDate">
                                    From Date
                                </label>

                                <input
                                    type="date"
                                    id="fromDate"
                                    value={fromDate}
                                    max={toDate || undefined}
                                    onChange={(e) =>
                                        resetPage(() =>
                                            setFromDate(e.target.value)
                                        )
                                    }
                                />
                            </div>

                            <div className="filter-group">
                                <label htmlFor="toDate">
                                    To Date
                                </label>

                                <input
                                    type="date"
                                    id="toDate"
                                    value={toDate}
                                    min={fromDate || undefined}
                                    onChange={(e) =>
                                        resetPage(() =>
                                            setToDate(e.target.value)
                                        )
                                    }
                                />
                            </div>
                        </>
                    )}

                    <div className="filter-group">
                        <label htmlFor="statusFilter">
                            Order Status
                        </label>

                        <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) =>
                                resetPage(() =>
                                    setStatusFilter(e.target.value)
                                )
                            }
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        className="clear-order-filters"
                        onClick={() => {
                            setDateMode("single");
                            setSelectedDate("");
                            setFromDate("");
                            setToDate("");
                            setStatusFilter("all");
                            setCurrentPage(1);
                        }}
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {orders.length === 0 ? (
                <p className="empty-orders">No requests found.</p>
            ) : filteredOrders.length === 0 ? (
                <p className="empty-orders">
                    No requests match the selected filters.
                </p>
            ) : (
                <>
                    <div className="orders-table-container">
                        <table className="customer-orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date of Order</th>
                                    <th>Status</th>
                                    <th>View</th>
                                    <th>Order</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>

                                        <td>
                                            {formatOrderDate(order.date)}
                                        </td>

                                        <td>
                                            <span
                                                className={`customer-order-status ${
                                                    order.status?.toLowerCase() === "delivered"
                                                        ? "delivered"
                                                        : "pending"
                                                }`}
                                            >
                                                {order.status || "Pending"}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="view-product-button"
                                                onClick={() =>
                                                    setSelectedOrder(order)
                                                }
                                            >
                                                View Request
                                            </button>
                                        </td>

                                        <td>
                                            <button
                                                className="reorder-button"
                                                onClick={() =>
                                                    handleReOrder(order)
                                                }
                                            >
                                                Re-Order
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="orders-result-count">
                        Showing {startIndex + 1}–
                        {Math.min(
                            startIndex + ORDERS_PER_PAGE,
                            filteredOrders.length
                        )} of {filteredOrders.length} requests
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() =>
                                    setCurrentPage((page) => page - 1)
                                }
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>

                            <span>
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() =>
                                    setCurrentPage((page) => page + 1)
                                }
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {selectedOrder && (
                <div className="order-modal-overlay">
                    <div className="order-modal">
                        <button
                            className="order-modal-close"
                            onClick={() => setSelectedOrder(null)}
                            aria-label="Close"
                        >
                            ×
                        </button>

                        <h2>Requested Products</h2>

                        <p>
                            <strong>Order ID:</strong> {selectedOrder.id}
                        </p>

                        {(selectedOrder.requestItems ||
                            selectedOrder.products ||
                            []).map((item, index) => (
                                <div className="order-product" key={index}>
                                    <p>
                                        {item.name} — {item.quantity}{" "}
                                        {item.quantityType || "pieces"}
                                    </p>

                                    {item.quantityType === "strip" && (
                                        <p>
                                            Total tablets:{" "}
                                            {item.quantity *
                                                (item.tabletsPerStrip || 10)}
                                        </p>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </main>
    );
}

export default Orders;