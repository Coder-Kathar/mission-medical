import "./Admin.css";
import { useState, useContext } from "react";
import { ProductContext } from "../context/ProductContext";

function Admin() {

    const {addProduct, products, deleteProduct} = useContext(ProductContext);

    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("medicines");
    const [requiresPrescription, setRequiresPrescription] = useState(false);

    const handleAddProduct = (e) => {
        e.preventDefault();

        const newProduct = {
            name: productName,
            category,
            description: "",
            usage: "",
            image: "",
            quantityType: "piece",
            requiresPrescription:
                category === "drug" ? requiresPrescription : false,
        };

        addProduct(newProduct);

        alert(`Product added: ${productName}`);

        setProductName("");
        setCategory("medicines");
        setRequiresPrescription(false);
    };
    return (
        <main className="admin-page">
            <h1>Admin Dashboard</h1>
            <p>Manage products, customer requests, and deliveries.</p>

            <section className="admin-cards">
                <div className="admin-card">
                    <h3>Total Orders</h3>
                    <p>0</p>
                </div>

                <div className="admin-card">
                    <h3>Pending Orders</h3>
                    <p>0</p>
                </div>

                <div className="admin-card">
                    <h3>Delivered Orders</h3>
                    <p>0</p>
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

                    <select
                        value={category}
                        onChange={(e) => {
                            const selectedCategory = e.target.value;

                            setCategory(selectedCategory);
                            setRequiresPrescription(selectedCategory === "drug");
                        }}
                        >
                        <option value="medicines">Medicine</option>
                        <option value="drug">Drug</option>
                        <option value="skin-care">Skin Care</option>
                        <option value="vitamins">Vitamins & Supplements</option>
                        <option value="personal-care">Personal Care</option>
                        <option value="baby-care">Baby Care</option>
                    </select>

                    {category === "drug" && (
                        <label>
                            <input
                                type="checkbox"
                                checked={requiresPrescription}
                                onChange={(e) =>
                                    setRequiresPrescription(e.target.checked)
                                }
                            />
                            Requires prescription
                        </label>
                    )}

                    <button type="submit">Add Product</button>
                </form>
            </section>

            <section className="admin-card">
                <h2>Manage Products</h2>

                {products.length === 0 ? (
                    <p>No products available.</p>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="admin-product-row">
                            <div>
                                <h3>{product.name}</h3>
                                <p>Category: {product.category}</p>
                                <p>
                                    Prescription Required:{" "}
                                    {product.requiresPrescription ? "Yes" : "No"}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (window.confirm(`Delete ${product.name}?`)) {
                                        deleteProduct(product.id);
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </div>
                       
                    ))
                )}
            </section>
        </main>
    );
}

export default Admin;
