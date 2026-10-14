import { useState } from "react";
import products from "../data/products";
import "./AdminProducts.css";

function AdminProducts() {

    const [productList, setProductList] = useState(() => {
        const savedProducts = localStorage.getItem("adminProducts");

        return savedProducts ? JSON.parse(savedProducts) : products;
    });

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        quantityType: "piece",
        requiresPrescription: false,
    });

    const handleAddProduct = (e) => {
        e.preventDefault();

        const newProduct = {
            id: Date.now(),
            ...formData,
            description: "",
            usage: "",
            image: "",
        };

        const updatedProducts = [...productList, newProduct];

        setProductList(updatedProducts);
        localStorage.setItem(
            "adminProducts",
            JSON.stringify(updatedProducts)
        );

        setFormData({
            name: "",
            category: "",
            quantityType: "piece",
            requiresPrescription: false,
        });

        setShowForm(false);
    };

    return (
        <main className="admin-products-page">
            <h1>Admin — Manage Products</h1>

            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cancel" : "+ Add Product"}
            </button>

            {showForm && (
                <form className="admin-product-form" onSubmit={handleAddProduct}>
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        required
                    />

                    <input
                        type="text"
                        placeholder="Category"
                        value={formData.category}
                        onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                        }
                        required
                    />

                    <select
                        value={formData.quantityType}
                        onChange={(e) =>
                            setFormData({ ...formData, quantityType: e.target.value })
                        }
                    >
                        <option value="tablet">Tablet</option>
                        <option value="strip">Strip</option>
                        <option value="piece">Piece</option>
                    </select>

                    <label>
                        <input
                            type="checkbox"
                            checked={formData.requiresPrescription}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    requiresPrescription: e.target.checked,
                                })
                            }
                        />
                        Prescription Required
                    </label>

                    <button type="submit">Save Product</button>
                </form>
            )}

            <p>Total Products: {productList.length}</p>

            <div className="admin-products-list">
                {productList.map((product) => (
                    <div className="admin-product-card" key={product.id}>
                        <img src={product.image} alt={product.name} />

                        <div>
                            <h3>{product.name}</h3>
                            <p>Category: {product.category}</p>
                            <p>
                                Prescription Required:{" "}
                                {product.requiresPrescription ? "Yes" : "No"}
                            </p>
                            <button
                                onClick={() => {
                                    if (!window.confirm(`Delete ${product.name}?`)) {
                                        return;
                                    }

                                    const updatedProducts = productList.filter(
                                        (item) => item.id !== product.id
                                    );

                                    setProductList(updatedProducts);

                                    localStorage.setItem(
                                        "adminProducts",
                                        JSON.stringify(updatedProducts)
                                    );
                                }}
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => {
                                    setFormData({
                                        name: product.name,
                                        category: product.category,
                                        quantityType: product.quantityType || "piece",
                                        requiresPrescription: product.requiresPrescription || false,
                                    });

                                    setShowForm(true);
                                }}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default AdminProducts;