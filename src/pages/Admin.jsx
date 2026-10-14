import "./Admin.css";
import { useState, useContext } from "react";
import { ProductContext } from "../context/ProductContext";

function Admin() {

    const { addProduct, products, deleteProduct, updateProduct } = useContext(ProductContext);

    const [editingProduct, setEditingProduct] = useState(null);
    const [editName, setEditName] = useState("");
    const [editCategory, setEditCategory] = useState("medicines");

    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("medicines");

    const [productDescription, setProductDescription] = useState("");
    const [productImage, setProductImage] = useState("");

    const [editDescription, setEditDescription] = useState("");
    const [editImage, setEditImage] = useState("");

    const [editQuantityType, setEditQuantityType] = useState("tablet");
    const [editTabletsPerStrip, setEditTabletsPerStrip] = useState("10");

    const [tabletsPerStrip, setTabletsPerStrip] = useState("10");

    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const productsPerPage = 10;

    const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCategory =
        filterCategory === "all" ||
        product.category === filterCategory;

        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(
        filteredProducts.length / productsPerPage
    );

    const startIndex = (currentPage - 1) * productsPerPage;

    const currentProducts = filteredProducts.slice(
        startIndex,
        startIndex + productsPerPage
    );

    const [filterStatus, setFilterStatus] = useState("all");

    const handleAddProduct = (e) => {
        e.preventDefault();

        const newProduct = {
            name: productName,
            category,
            description: productDescription.trim(),
            usage: "",
            image: productImage.trim(),
            quantityType: category === "medicines" || category === "drug"
                ? "tablet"
                : "piece",

            tabletsPerStrip:
                category === "medicines" || category === "drug"
                    ? Number(tabletsPerStrip)
                    : undefined,
            requiresPrescription: category === "drug",
        };

        addProduct(newProduct);

        alert(`Product added: ${productName}`);

        setProductName("");
        setProductDescription("");
        setProductImage("");
        setCategory("medicines");
        setTabletsPerStrip("10");
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setEditName(product.name);
        setEditCategory(product.category);
        setEditDescription(product.description || "");
        setEditImage(product.image || "");
        setEditQuantityType(product.quantityType || "tablet");
        setEditTabletsPerStrip(String(product.tabletsPerStrip || 10));
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();

        updateProduct({
            ...editingProduct,
            name: editName.trim(),
            category: editCategory,
            quantityType:
                editCategory === "medicines" || editCategory === "drug"
                    ? editQuantityType
                    : "piece",
            tabletsPerStrip:
                editCategory === "medicines" || editCategory === "drug"
                    ? Number(editTabletsPerStrip)
                    : undefined,
            requiresPrescription: editCategory === "drug",
            description: editDescription.trim(),
            image: editImage.trim(),
        });

        setEditingProduct(null);
        alert("Product updated successfully!");
    };

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");

    const totalOrders = orders.length;
    
    const pendingOrders = orders.filter(
        (order) => order.status === "Pending"
    ).length;

    const deliveredOrders = orders.filter(
        (order) => order.status === "Delivered"
    ).length;
    
    const getTotalItems = (order) => {
        const items = order.requestItems || order.items || [];

        return items.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0
        );
    };

    const filteredOrders = orders.filter((order) => {
        return (
            filterStatus === "all" ||
            (order.status || "Pending") === filterStatus
        );
    });

    return (
        <main className="admin-page">
            <h1>Admin Dashboard</h1>
            <p>Manage products, customer requests, and deliveries.</p>

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

            <section className="admin-card">
                <h2>Add New Product</h2>

                <form onSubmit={handleAddProduct}>
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />

                    <textarea
                        placeholder="Product Description"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Product Image URL"
                        value={productImage}
                        onChange={(e) => setProductImage(e.target.value)}
                    />

                    <select
                        value={category}
                        onChange={(e) => {
                            const selectedCategory = e.target.value;

                            setCategory(selectedCategory);
                        }}
                        >
                        <option value="medicines">Medicine</option>
                        <option value="drug">Drug</option>
                        <option value="skin-care">Skin Care</option>
                        <option value="vitamins">Vitamins & Supplements</option>
                        <option value="personal-care">Personal Care</option>
                        <option value="baby-care">Baby Care</option>
                    </select>

                    {(category === "medicines" || category === "drug") && (
                        <input
                            type="number"
                            min="1"
                            placeholder="Tablets per strip"
                            value={tabletsPerStrip}
                            onChange={(e) => setTabletsPerStrip(e.target.value)}
                            required
                        />
                    )}

                    <button type="submit">Add Product</button>
                </form>
            </section>

            <section className="admin-card">
                <h2>Manage Products</h2>

                <div className="admin-products-toolbar">
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />

                    <select
                        value={filterCategory}
                        onChange={(e) => {
                            setFilterCategory(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="all">All Categories</option>
                        <option value="medicines">Medicine</option>
                        <option value="drug">Drug</option>
                        <option value="skin-care">Skin Care</option>
                        <option value="vitamins">Vitamins & Supplements</option>
                        <option value="personal-care">Personal Care</option>
                        <option value="baby-care">Baby Care</option>
                    </select>
                </div>
                
                {editingProduct && (
                    <form onSubmit={handleSaveEdit}>
                        <h3>Edit Product</h3>

                        <input
                            type="text"
                            placeholder="Product Name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                        />

                        <textarea
                            placeholder="Product Description"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Product Image URL"
                            value={editImage}
                            onChange={(e) => setEditImage(e.target.value)}
                        />

                        <select
                            value={editCategory}
                            onChange={(e) => {
                                const selectedCategory = e.target.value;
                                setEditCategory(selectedCategory);
                            }}
                        >
                            <option value="medicines">Medicine</option>
                            <option value="drug">Drug</option>
                            <option value="skin-care">Skin Care</option>
                            <option value="vitamins">Vitamins & Supplements</option>
                            <option value="personal-care">Personal Care</option>
                            <option value="baby-care">Baby Care</option>
                        </select>

                        {(editCategory === "medicines" || editCategory === "drug") && (
                            <>
                                <select
                                    value={editQuantityType}
                                    onChange={(e) => setEditQuantityType(e.target.value)}
                                >
                                    <option value="tablet">Tablet / Strip</option>
                                </select>

                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Tablets per strip"
                                    value={editTabletsPerStrip}
                                    onChange={(e) => setEditTabletsPerStrip(e.target.value)}
                                    required
                                />
                            </>
                        )}

                        <button type="submit">Save Changes</button>

                        <button
                            type="button"
                            onClick={() => setEditingProduct(null)}
                        >
                            Cancel
                        </button>
                    </form>
                )}

                {filteredProducts.length === 0 ? (
                    <p>No products match your search.</p>
                ) : (
                    <>
                        <div className="admin-products-table-wrapper">
                            <table className="admin-products-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Prescription</th>
                                        <th>Quantity Details</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentProducts.map((product) => (
                                        <tr key={product.id}>
                                            <td className="product-name">
                                                {product.name}
                                            </td>

                                            <td>{product.category}</td>

                                            <td>
                                                <span
                                                    className={`prescription-status ${
                                                        product.requiresPrescription
                                                            ? "prescription-required"
                                                            : ""
                                                    }`}
                                                >
                                                    {product.requiresPrescription
                                                        ? "Required"
                                                        : "Not required"}
                                                </span>
                                            </td>

                                            <td>
                                                {product.quantityType === "tablet"
                                                    ? `${product.tabletsPerStrip || 10} tablets/strip`
                                                    : "Pieces"}
                                            </td>

                                            <td>
                                                <div className="admin-product-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditClick(product)}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-button"
                                                        onClick={() => {
                                                            if (
                                                                window.confirm(
                                                                    `Delete ${product.name}?`
                                                                )
                                                            ) {
                                                                deleteProduct(product.id);
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {selectedOrder && (
                            <div className="order-modal-overlay">
                                <div className="order-modal">
                                    <h2>Order Details</h2>

                                    <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                                    <p><strong>Customer:</strong> {selectedOrder.customerName || "N/A"}</p>
                                    <p><strong>Mobile:</strong> {selectedOrder.mobileNumber || "N/A"}</p>
                                    <p><strong>Address:</strong> {selectedOrder.deliveryAddress || "N/A"}</p>
                                    <p><strong>Status:</strong> {selectedOrder.status || "Pending"}</p>

                                    <h3>Requested Products</h3>

                                    {(selectedOrder.requestItems || selectedOrder.items || []).map(
                                        (item, index) => (       
                                            <p key={item.id || index} className="order-item-details">
                                                <strong>{item.name || item.productName || "Product"}</strong>
                                                <span>— Quantity: {item.quantity}</span>
                                                <span>
                                                    — Prescription:{" "}
                                                    {item.requiresPrescription ? "Required" : "Not required"}
                                                </span>
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

                        <div className="admin-products-pagination">
                            <span>
                                Showing {startIndex + 1}–
                                {Math.min(
                                    startIndex + productsPerPage,
                                    filteredProducts.length
                                )}{" "}
                                of {filteredProducts.length} products
                            </span>

                            <div className="admin-product-actions">
                                <button
                                    type="button"
                                    disabled={currentPage <= 1}
                                    onClick={() => setCurrentPage((page) => page - 1)}
                                >
                                    Previous
                                </button>

                                <span>
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    type="button"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => setCurrentPage((page) => page + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </section>
                        
            <section className="admin-card">
                
                <div className="orders-header">
                    <h2>Manage Customer Orders</h2>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Orders</option>
                        <option value="Pending">Pending Orders</option>
                        <option value="Delivered">Delivered Orders</option>
                    </select>
                </div>

                {orders.length === 0 ? (
                    <p>No customer orders available.</p>
                ) : (
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
                                {filteredOrders.map((order) => (
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
                )}
            </section>
        </main>
    );
}

export default Admin;
