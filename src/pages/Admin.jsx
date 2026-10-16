import "./Admin.css";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

function Admin() {
    const { products } = useContext(ProductContext);

    const orders = JSON.parse(
        localStorage.getItem("orders") || "[]"
    );

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order) => (order.status || "Pending") === "Pending"
    ).length;

    const deliveredOrders = orders.filter(
        (order) => order.status === "Delivered"
    ).length;

    const orderStatusData = [
        { status: "Pending", count: pendingOrders },
        { status: "Delivered", count: deliveredOrders },
    ];

    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const ordersPerPage = 10;

    // Newest orders first
    const newestFirstOrders = [...orders].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        return (
            (Number.isNaN(dateB) ? 0 : dateB) -
            (Number.isNaN(dateA) ? 0 : dateA)
        );
    });

    const filteredOrders = newestFirstOrders.filter((order) => {
        return (
            filterStatus === "all" ||
            (order.status || "Pending") === filterStatus
        );
    });

    const totalOrderPages = Math.ceil(
        filteredOrders.length / ordersPerPage
    );

    const startIndex = (currentPage - 1) * ordersPerPage;

    const currentOrders = filteredOrders.slice(
        startIndex,
        startIndex + ordersPerPage
    );

    const getTotalItems = (order) => {
        const items = order.requestItems || order.items || [];

        return items.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0
        );
    };

    return (
        <main className="admin-page">
            <h1>Admin Dashboard</h1>
            <p>Manage products, customer requests, and deliveries.</p>

            {/* Summary Cards */}
            <section className="admin-cards">
                <div className="admin-card">
                    <h3>Total Orders</h3>
                    <p>{totalOrders}</p>
                </div>

                <div className="admin-card">
                    <h3>Pending Orders</h3>
                    <p>{pendingOrders}</p>
                </div>

                <div className="admin-card">
                    <h3>Delivered Orders</h3>
                    <p>{deliveredOrders}</p>
                </div>

                <div className="admin-card">
                    <h3>Total Products</h3>
                    <p>{products.length}</p>
                </div>
            </section>

            {/* Management Navigation */}
            <section className="admin-cards">
                <Link
                    to="/admin/products"
                    className="admin-card admin-navigation-card"
                >
                    <div>
                        <h3>Manage Products</h3>
                        <p>Add, edit, search, and delete products.</p>
                    </div>

                    <span className="admin-navigation-action">
                        Open Products →
                    </span>
                </Link>

                <Link
                    to="/admin/orders"
                    className="admin-card admin-navigation-card"
                >
                    <div>
                        <h3>Manage Orders</h3>
                        <p>Review orders and manage deliveries.</p>
                    </div>

                    <span className="admin-navigation-action">
                        Open Orders →
                    </span>
                </Link>
            </section>

            {/* Customer Orders Table - Next Step */}
                
            <section className="admin-card">
                <div className="orders-header">
                    <h2>Manage Customer Orders</h2>

                    <select
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="all">All Orders</option>
                        <option value="Pending">Pending Orders</option>
                        <option value="Delivered">Delivered Orders</option>
                    </select>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="empty-orders">
                        <h3>No orders found</h3>
                        <p>Customer orders will appear here when available.</p>
                    </div>
                ) : (
                    <>
                        <div className="admin-products-table-wrapper">
                            <table className="admin-products-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Mobile</th>
                                        <th>Order Date</th>
                                        <th>Total Items</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{order.customerName || "N/A"}</td>
                                            <td>{order.mobileNumber || "N/A"}</td>
                                            <td>{order.date || "N/A"}</td>
                                            <td>{getTotalItems(order)}</td>
                                            <td>
                                                <span
                                                    className={`order-status ${
                                                        order.status === "Delivered"
                                                            ? "order-delivered"
                                                            : "order-pending"
                                                    }`}
                                                >
                                                    {order.status || "Pending"}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="view-details-button"
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="admin-products-pagination">
                            <span>
                                Showing {startIndex + 1}–
                                {Math.min(
                                    startIndex + ordersPerPage,
                                    filteredOrders.length
                                )} of {filteredOrders.length} orders
                            </span>

                            <div className="admin-product-actions">
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
                                    Page {currentPage} of {totalOrderPages}
                                </span>

                                <button
                                    type="button"
                                    disabled={currentPage >= totalOrderPages}
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

                {selectedOrder && (
                    <div className="order-modal-overlay">
                        <div className="order-modal">
                            <h2>Order Details</h2>

                            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                            <p><strong>Customer:</strong> {selectedOrder.customerName || "N/A"}</p>
                            <p><strong>Mobile:</strong> {selectedOrder.mobileNumber || "N/A"}</p>
                            <p><strong>Address:</strong> {selectedOrder.deliveryAddress || "N/A"}</p>
                            <p><strong>Date:</strong> {selectedOrder.date || "N/A"}</p>
                            <p><strong>Status:</strong> {selectedOrder.status || "Pending"}</p>
                            <p>
                                <strong>Prescription:</strong>{" "}
                                {selectedOrder.prescriptionName || "Not attached"}
                            </p>

                            <h3>Requested Products</h3>

                            {(selectedOrder.requestItems || selectedOrder.items || []).map(
                                (item, index) => (
                                    <p
                                        key={item.id || index}
                                        className="order-item-details"
                                    >
                                        <strong>{item.name || item.productName || "Product"}</strong>
                                        {" — Quantity: "}
                                        {item.quantity}
                                        {" "}
                                        {item.quantityType || "pieces"}
                                    </p>
                                )
                            )}

                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* Order Status Visualization */}
            <section className="admin-card order-chart-card">
            <div className="chart-heading">
                <div>
                    <h2>Order Status Overview</h2>
                    <p>Track your customer orders at a glance.</p>
                </div>

                <span className="chart-total">
                    {totalOrders} Total Orders
                </span>
            </div>

            <div className="order-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={orderStatusData}
                        margin={{ top: 15, right: 15, left: 0, bottom: 5 }}
                        barSize={65}
                    >
                        <CartesianGrid
                            strokeDasharray="4 4"
                            vertical={false}
                            stroke="#E5E7EB"
                        />
                        <XAxis
                            dataKey="status"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#4B5563", fontSize: 13 }}
                        />
                        <YAxis
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6B7280", fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: "#E8F5EF" }}
                            contentStyle={{
                                borderRadius: "10px",
                                border: "1px solid #D1D5DB",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            }}
                        />
                        <Bar
                            dataKey="count"
                            name="Orders"
                            fill="#159A7C"
                            radius={[8, 8, 0, 0]}
                            minPointSize={0}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-legend">
                <span><i className="legend-dot pending-dot"></i> Pending: {pendingOrders}</span>
                <span><i className="legend-dot delivered-dot"></i> Delivered: {deliveredOrders}</span>
            </div>
        </section>

            {/* Analytics - Later */}
            <section className="admin-card">
                <h2>Order Analytics</h2>
                <p>
                    Detailed order trends and demand analytics will
                    be added here.
                </p>
            </section>
        </main>
    );
}

export default Admin;
