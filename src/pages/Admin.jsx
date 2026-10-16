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
    PieChart,
    Pie,
    Legend,
    Cell,
    LineChart,
    Line,
} from "recharts";

function Admin() {
    const { products } = useContext(ProductContext);

    const prescriptionProductCount = products.filter(
        (product) => product.requiresPrescription === true
    ).length;

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

    const [analyticsPeriod, setAnalyticsPeriod] = useState("daily");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");

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

    const getOrderDate = (order) => {
        const value = order.createdAt || order.date;
        if (!value) return null;

        const parsedDate = new Date(value);
        return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getAnalyticsOrders = () => {
        return orders.filter((order) => {
            const orderDate = getOrderDate(order);
            if (!orderDate) return false;

            orderDate.setHours(0, 0, 0, 0);

            if (analyticsPeriod === "custom") {
                if (!customStartDate || !customEndDate) return false;

                const start = new Date(`${customStartDate}T00:00:00`);
                const end = new Date(`${customEndDate}T00:00:00`);

                return orderDate >= start && orderDate <= end;
            }

            if (analyticsPeriod === "daily") {
                return orderDate.getTime() === today.getTime();
            }

            if (analyticsPeriod === "weekly") {
                const startOfWeek = new Date(today);
                const day = (today.getDay() + 6) % 7;
                startOfWeek.setDate(today.getDate() - day);

                return orderDate >= startOfWeek && orderDate <= today;
            }

            if (analyticsPeriod === "monthly") {
                return (
                    orderDate.getMonth() === today.getMonth() &&
                    orderDate.getFullYear() === today.getFullYear()
                );
            }

            return true;
        });
    };

    const analyticsOrders = getAnalyticsOrders();

    const analyticsPending = analyticsOrders.filter(
        (order) => (order.status || "Pending") === "Pending"
    ).length;

    const analyticsDelivered = analyticsOrders.filter(
        (order) => order.status === "Delivered"
    ).length;

        const productDemand = {};

    analyticsOrders.forEach((order) => {
        const items = order.requestItems || order.items || [];

        items.forEach((item) => {
            const name = item.name || item.productName || "Unknown Product";
            const quantity = Number(item.quantity) || 0;

            if (!productDemand[name]) {
                productDemand[name] = {
                    name,
                    quantity: 0,
                    category: item.category || "Uncategorized",
                };
            }

            productDemand[name].quantity += quantity;
        });
    });

    const popularProducts = Object.values(productDemand)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

    const categoryDemand = {};

    analyticsOrders.forEach((order) => {
        const items = order.requestItems || order.items || [];

        items.forEach((item) => {
            const category = item.category || "Uncategorized";
            const quantity = Number(item.quantity) || 0;

            if (!categoryDemand[category]) {
                categoryDemand[category] = {
                    category,
                    quantity: 0,
                };
            }

            categoryDemand[category].quantity += quantity;
        });
    });

    const categoryDemandData = Object.values(categoryDemand)
        .sort((a, b) => b.quantity - a.quantity);

    const orderTrendsMap = {};

    analyticsOrders.forEach((order) => {
        const orderDate = getOrderDate(order);

        if (!orderDate) return;

        const dateKey = [
            orderDate.getFullYear(),
            String(orderDate.getMonth() + 1).padStart(2, "0"),
            String(orderDate.getDate()).padStart(2, "0"),
        ].join("-");

        if (!orderTrendsMap[dateKey]) {
            orderTrendsMap[dateKey] = {
                date: dateKey,
                pending: 0,
                delivered: 0,
            };
        }

        const status = order.status || "Pending";

        if (status === "Delivered") {
            orderTrendsMap[dateKey].delivered += 1;
        } else {
            orderTrendsMap[dateKey].pending += 1;
        }
    });

    const orderTrendsData = Object.values(orderTrendsMap).sort(
        (a, b) => a.date.localeCompare(b.date)
    );

    // Orders that have an uploaded prescription name
    const prescriptionOrders = analyticsOrders.filter(
        (order) => Boolean(order.prescriptionName)
    );

    // Items that require a prescription
    const prescriptionRequiredItems = analyticsOrders.flatMap(
        (order) =>
            (order.requestItems || order.items || []).filter(
                (item) => item.requiresPrescription === true
            )
    );

    const prescriptionRequiredQuantity = prescriptionRequiredItems.reduce(
        (total, item) => total + (Number(item.quantity) || 0),
        0
    );

    // Unique orders containing at least one prescription-required item
    const ordersRequiringPrescription = analyticsOrders.filter(
        (order) =>
            (order.requestItems || order.items || []).some(
                (item) => item.requiresPrescription === true
            )
    );

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

            {/* Order Analytics */}
            <section className="admin-card analytics-card">
                <div className="chart-heading">
                    <div>
                        <h2>Order Analytics</h2>
                        <p>Analyze customer orders over time.</p>
                    </div>
                </div>

                <div className="analytics-filters">
                    <button
                        className={analyticsPeriod === "daily" ? "active" : ""}
                        onClick={() => setAnalyticsPeriod("daily")}
                    >
                        Daily
                    </button>

                    <button
                        className={analyticsPeriod === "weekly" ? "active" : ""}
                        onClick={() => setAnalyticsPeriod("weekly")}
                    >
                        Weekly
                    </button>

                    <button
                        className={analyticsPeriod === "monthly" ? "active" : ""}
                        onClick={() => setAnalyticsPeriod("monthly")}
                    >
                        Monthly
                    </button>

                    <button
                        className={analyticsPeriod === "custom" ? "active" : ""}
                        onClick={() => setAnalyticsPeriod("custom")}
                    >
                        Custom Range
                    </button>
                </div>

                {analyticsPeriod === "custom" && (
                    <div className="analytics-date-inputs">
                        <label>
                            Start date
                            <input
                                type="date"
                                value={customStartDate}
                                max={customEndDate || undefined}
                                onChange={(e) => setCustomStartDate(e.target.value)}
                            />
                        </label>

                        <label>
                            End date
                            <input
                                type="date"
                                value={customEndDate}
                                min={customStartDate || undefined}
                                max={new Date().toISOString().slice(0, 10)}
                                onChange={(e) => setCustomEndDate(e.target.value)}
                            />
                        </label>
                    </div>
                )}

                <div className="analytics-summary">
                    <div className="analytics-metric">
                        <span>Total Orders</span>
                        <strong>{analyticsOrders.length}</strong>
                    </div>

                    <div className="analytics-metric">
                        <span>Pending</span>
                        <strong>{analyticsPending}</strong>
                    </div>

                    <div className="analytics-metric">
                        <span>Delivered</span>
                        <strong>{analyticsDelivered}</strong>
                    </div>
                </div>

                <div className="analytics-chart-panel">
                    <h3>Top 5 Popular Products</h3>
                    <p>Products ranked by total quantity requested.</p>

                    {popularProducts.length === 0 ? (
                        <p>No product demand data available for this period.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart
                                data={popularProducts}
                                layout="vertical"
                                margin={{ top: 10, right: 25, left: 15, bottom: 10 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    horizontal={false}
                                />
                                <XAxis type="number" allowDecimals={false} />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={120}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip />
                                <Bar
                                    dataKey="quantity"
                                    name="Quantity Requested"
                                    fill="#159A7C"
                                    radius={[0, 6, 6, 0]}
                                >
                                    {popularProducts.map((product) => (
                                        <Cell
                                            key={product.name}
                                            fill="#159A7C"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="analytics-chart-panel">
                    <h3>Category Demand</h3>
                    <p>Requested quantities grouped by product category.</p>

                    {categoryDemandData.length === 0 ? (
                        <p>No category demand data available for this period.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={categoryDemandData}
                                    dataKey="quantity"
                                    nameKey="category"
                                    cx="50%"
                                    cy="45%"
                                    outerRadius={100}
                                    label={({ category, percent }) =>
                                        `${category} ${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {categoryDemandData.map((entry, index) => (
                                        <Cell
                                            key={entry.category}
                                            fill={[
                                                "#0F6B4F",
                                                "#159A7C",
                                                "#79C9A8",
                                                "#E9A23B",
                                                "#6B8EAE",
                                                "#B39DDB",
                                            ][index % 6]}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
                <div className="analytics-chart-panel">
                    <h3>Order Trends</h3>
                    <p>Track pending and delivered orders over time.</p>

                    {orderTrendsData.length === 0 ? (
                        <p>No order trend data available for this period.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart
                                data={orderTrendsData}
                                margin={{ top: 15, right: 20, left: 0, bottom: 10 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11 }}
                                    tickFormatter={(value) => {
                                        const date = new Date(`${value}T00:00:00`);
                                        return date.toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                        });
                                    }}
                                />

                                <YAxis allowDecimals={false} />

                                <Tooltip
                                    labelFormatter={(value) => {
                                        const date = new Date(`${value}T00:00:00`);
                                        return date.toLocaleDateString("en-IN");
                                    }}
                                />

                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="pending"
                                    name="Pending"
                                    stroke="#E9A23B"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="delivered"
                                    name="Delivered"
                                    stroke="#159A7C"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </section>
            <section className="admin-card analytics-card">
                <h2>Prescription Insights</h2>

                <div className="analytics-summary">
                    <div className="analytics-metric">
                        <h3>Orders With Prescription</h3>
                        <p>{prescriptionOrders.length}</p>
                    </div>

                    <div className="analytics-metric">
                        <h3>Orders Requiring Prescription</h3>
                        <p>{ordersRequiringPrescription.length}</p>
                    </div>

                    <div className="analytics-metric">
                        <h3>Prescription-Required Products</h3>
                        <p>{prescriptionProductCount}</p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Admin;
