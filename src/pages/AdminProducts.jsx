import { useEffect, useState, useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import "./AdminProducts.css";

// Product categories provided by the client.
// Original spellings are preserved.
const PRODUCT_CATEGORIES = [
    "Tablet",
    "Capsule",
    "Syrup",
    "Oilment",
    "Create",
    "Facewash",
    "Powder",
    "Diaper",
    "Soap",
    "Injection",
    "Insulin",
    "Lotion",
    "Cotton",
    "Gause",
    "Spray",
    "Drops",
    "IV",
    "Cream",
    "Liquid",
    "Gel",
    "Plaster",
    "Others",
];

function AdminProducts() {
    const {
        products: productList,
        addProduct,
        updateProduct,
        deleteProduct,
    } = useContext(ProductContext);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [removeExistingImage, setRemoveExistingImage] = useState(false);

    // Category states
    const [categorySelection, setCategorySelection] = useState("");
    const [customCategory, setCustomCategory] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [prescriptionFilter, setPrescriptionFilter] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    const initialFormData = {
        name: "",
        description: "",
        usage: "",
        category: "",
        quantityType: "piece",
        tabletsPerStrip: "",
        requiresPrescription: false,
    };

    const [formData, setFormData] = useState(initialFormData);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter, prescriptionFilter]);

    const categories = [
        ...new Set(
            productList.map((product) => product.category).filter(Boolean)
        ),
    ];

    // Filter products
    const filteredProducts = productList.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesCategory =
            categoryFilter === "all" ||
            product.category === categoryFilter;

        const matchesPrescription =
            prescriptionFilter === "all" ||
            (prescriptionFilter === "yes"
                ? product.requiresPrescription === true
                : product.requiresPrescription !== true);

        return matchesSearch && matchesCategory && matchesPrescription;
    });

    // Pagination
    const totalPages = Math.ceil(
        filteredProducts.length / productsPerPage
    );

    const startIndex = (currentPage - 1) * productsPerPage;

    const currentProducts = filteredProducts.slice(
        startIndex,
        startIndex + productsPerPage
    );

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const prescriptionProductCount = productList.filter(
        (product) => product.requiresPrescription === true
    ).length;

    // Reset form
    const resetForm = () => {
        setFormData(initialFormData);
        setEditingId(null);
        setImageFile(null);
        setImagePreview("");
        setRemoveExistingImage(false);
        setCategorySelection("");
        setCustomCategory("");
        setShowForm(false);
    };

    // Handle quantity type change
    const handleQuantityTypeChange = (e) => {
        const quantityType = e.target.value;

        setFormData((previous) => ({
            ...previous,
            quantityType,
            tabletsPerStrip:
                quantityType === "tablet"
                    ? previous.tabletsPerStrip
                    : "",
        }));
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Please select an image smaller than 5 MB.");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            if (reader.error) {
                alert("Unable to read the selected image.");
                return;
            }

            setImageFile(file);
            setImagePreview(reader.result);
            setRemoveExistingImage(false);
        };

        reader.onerror = () => {
            alert("Unable to read the selected image.");
        };

        reader.readAsDataURL(file);
    };

    // Handle category selection
    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;

        setCategorySelection(selectedCategory);

        if (selectedCategory === "Others") {
            setFormData((previous) => ({
                ...previous,
                category: "",
            }));
        } else {
            setCustomCategory("");

            setFormData((previous) => ({
                ...previous,
                category: selectedCategory,
            }));
        }
    };

    // Add product
    const handleAddProduct = (e) => {
        e.preventDefault();

        const finalCategory =
            categorySelection === "Others"
                ? customCategory.trim()
                : categorySelection.trim();

        if (!finalCategory) {
            alert("Please select or enter a product category.");
            return;
        }

        const newProduct = {
            ...formData,
            name: formData.name.trim(),
            description: formData.description.trim(),
            usage: formData.usage.trim(),
            category: finalCategory,
            tabletsPerStrip:
                formData.quantityType === "tablet"
                    ? Number(formData.tabletsPerStrip)
                    : null,
            image: imagePreview || "",
        };

        addProduct(newProduct);

        resetForm();
    };

    // Edit product
    const handleEditProduct = (product) => {
        setEditingId(product.id);

        const isPredefinedCategory =
            PRODUCT_CATEGORIES.includes(product.category) &&
            product.category !== "Others";

        setCategorySelection(
            isPredefinedCategory ? product.category : "Others"
        );

        setCustomCategory(
            isPredefinedCategory ? "" : product.category || ""
        );

        setFormData({
            name: product.name || "",
            description: product.description || "",
            usage: product.usage || "",
            category: product.category || "",
            quantityType:
                product.quantityType === "tablet"
                    ? "tablet"
                    : "piece",
            tabletsPerStrip:
                product.quantityType === "tablet"
                    ? product.tabletsPerStrip ?? ""
                    : "",
            requiresPrescription:
                product.requiresPrescription === true,
        });

        setImageFile(null);
        setImagePreview(product.image || "");
        setRemoveExistingImage(false);
        setShowForm(true);
    };

    // Save edited product
    const handleSaveProduct = (e) => {
        e.preventDefault();

        if (editingId === null) {
            handleAddProduct(e);
            return;
        }

        const existingProduct = productList.find(
            (product) => product.id === editingId
        );

        if (!existingProduct) {
            alert("Product not found.");
            return;
        }

        const finalCategory =
            categorySelection === "Others"
                ? customCategory.trim()
                : categorySelection.trim();

        if (!finalCategory) {
            alert("Please select or enter a product category.");
            return;
        }

        const updatedProduct = {
            ...existingProduct,
            ...formData,
            name: formData.name.trim(),
            description: formData.description.trim(),
            usage: formData.usage.trim(),
            category: finalCategory,
            tabletsPerStrip:
                formData.quantityType === "tablet"
                    ? Number(formData.tabletsPerStrip)
                    : null,
            image: imageFile
                ? imagePreview
                : removeExistingImage
                    ? ""
                    : existingProduct.image || "",
        };

        updateProduct(updatedProduct);

        resetForm();
    };

    // Delete product
    const handleDeleteProduct = (product) => {
        if (!window.confirm(`Delete ${product.name}?`)) return;

        deleteProduct(product.id);
    };

    return (
        <main className="admin-products-page">

            <h1>Admin — Manage Products</h1>

            <button
                type="button"
                onClick={() => {
                    if (showForm) {
                        resetForm();
                    } else {
                        setShowForm(true);
                    }
                }}
            >
                {showForm ? "Cancel" : "+ Add Product"}
            </button>

            {/* Add / Edit Product Form */}
            {showForm && (
                <form
                    className="admin-product-form"
                    onSubmit={handleSaveProduct}
                >

                    {/* Product Name */}
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                name: e.target.value,
                            })
                        }
                        required
                    />

                    {/* Product Description */}
                    <textarea
                        placeholder="Product Description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                        rows="3"
                        required
                    />

                    {/* Product Usage */}
                    <textarea
                        placeholder="Product Usage"
                        value={formData.usage}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                usage: e.target.value,
                            })
                        }
                        rows="3"
                        required
                    />

                    {/* Product Image Upload */}
                    <div className="product-image-upload">

                        <label htmlFor="productImage">
                            Product Image
                        </label>

                        <input
                            id="productImage"
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleImageChange}
                        />

                        {imagePreview && (
                            <div className="image-preview">

                                <img
                                    src={imagePreview}
                                    alt="Product preview"
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        setImageFile(null);
                                        setImagePreview("");
                                        setRemoveExistingImage(true);
                                    }}
                                >
                                    Remove Image
                                </button>

                            </div>
                        )}

                    </div>

                    {/* Product Category */}
                    <label htmlFor="productCategory">
                        Product Category
                    </label>

                    <select
                        id="productCategory"
                        value={categorySelection}
                        onChange={handleCategoryChange}
                        required
                    >
                        <option value="">Select Category</option>

                        {PRODUCT_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    {/* Custom Category */}
                    {categorySelection === "Others" && (
                        <input
                            type="text"
                            placeholder="Enter custom category"
                            value={customCategory}
                            onChange={(e) => {
                                const value = e.target.value;

                                setCustomCategory(value);

                                setFormData((previous) => ({
                                    ...previous,
                                    category: value,
                                }));
                            }}
                            required
                        />
                    )}

                    {/* Quantity Type */}
                    <label htmlFor="quantityType">
                        Quantity Type
                    </label>

                    <select
                        id="quantityType"
                        value={formData.quantityType}
                        onChange={handleQuantityTypeChange}
                    >
                        <option value="tablet">Tablet</option>
                        <option value="piece">Piece</option>
                    </select>

                    {formData.quantityType === "tablet" && (
                        <input
                            type="number"
                            placeholder="Tablets per strip"
                            min="1"
                            step="1"
                            value={formData.tabletsPerStrip}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    tabletsPerStrip: e.target.value,
                                })
                            }
                            required
                        />
                    )}

                    {/* Prescription */}
                    <label className="prescription-checkbox">
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

                    <button type="submit">
                        {editingId === null
                            ? "Save Product"
                            : "Update Product"}
                    </button>

                </form>
            )}

            {/* Product Overview */}
            <section className="product-overview">

                <div className="product-overview-card">
                    <span>Total Products</span>
                    <h2>{productList.length}</h2>
                </div>

                <div className="product-overview-card">
                    <span>Categories</span>
                    <h2>{categories.length}</h2>
                </div>

                <div className="product-overview-card">
                    <span>Prescription-Required Products</span>
                    <h2>{prescriptionProductCount}</h2>
                </div>

            </section>

            {/* Product Filters */}
            <section className="product-filters">

                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="all">All Categories</option>

                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <select
                    value={prescriptionFilter}
                    onChange={(e) => setPrescriptionFilter(e.target.value)}
                >
                    <option value="all">All Products</option>
                    <option value="yes">Prescription Required</option>
                    <option value="no">No Prescription Required</option>
                </select>

            </section>

            {/* Product List */}
            {filteredProducts.length === 0 ? (

                <div className="products-empty-state">

                    <h2>
                        {productList.length === 0
                            ? "No products yet"
                            : "No products found"}
                    </h2>

                    <p>
                        {productList.length === 0
                            ? "Start building your catalog by adding your first product."
                            : "Try changing your search or filters."}
                    </p>

                    {productList.length === 0 ? (

                        <button
                            type="button"
                            onClick={() => setShowForm(true)}
                        >
                            + Add Product
                        </button>

                    ) : (

                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm("");
                                setCategoryFilter("all");
                                setPrescriptionFilter("all");
                                setCurrentPage(1);
                            }}
                        >
                            Clear Search & Filters
                        </button>

                    )}

                </div>

            ) : (

                <div className="admin-products-list">

                    {currentProducts.map((product) => (

                        <div
                            className="admin-product-card"
                            key={product.id}
                        >

                            {product.image && (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                />
                            )}

                            <div>

                                <h3>{product.name}</h3>

                                <p>Category: {product.category}</p>

                                <p>
                                    Quantity Type: {product.quantityType}
                                </p>

                                {product.quantityType === "tablet" && (
                                    <p>
                                        Tablets per strip: {product.tabletsPerStrip}
                                    </p>
                                )}

                                <p>
                                    Prescription Required:{" "}
                                    {product.requiresPrescription
                                        ? "Yes"
                                        : "No"}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => handleEditProduct(product)}
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDeleteProduct(product)}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (

                <div className="product-pagination">

                    <p>
                        Showing {startIndex + 1}–
                        {Math.min(
                            startIndex + productsPerPage,
                            filteredProducts.length
                        )}
                        {" "}of {filteredProducts.length} products
                    </p>

                    <div className="pagination-buttons">

                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => goToPage(currentPage - 1)}
                        >
                            Previous
                        </button>

                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                        )
                            .filter((page) =>
                                page === 1 ||
                                page === totalPages ||
                                Math.abs(page - currentPage) <= 1
                            )
                            .reduce((pages, page, index, visiblePages) => {

                                if (
                                    index > 0 &&
                                    page - visiblePages[index - 1] > 1
                                ) {
                                    pages.push("...");
                                }

                                pages.push(page);
                                return pages;

                            }, [])
                            .map((page, index) =>
                                page === "..." ? (

                                    <span key={`ellipsis-${index}`}>
                                        ...
                                    </span>

                                ) : (

                                    <button
                                        type="button"
                                        key={page}
                                        className={
                                            currentPage === page
                                                ? "active-page"
                                                : ""
                                        }
                                        onClick={() => goToPage(page)}
                                    >
                                        {page}
                                    </button>

                                )
                            )}

                        <button
                            type="button"
                            disabled={
                                currentPage === totalPages ||
                                totalPages === 0
                            }
                            onClick={() => goToPage(currentPage + 1)}
                        >
                            Next
                        </button>

                    </div>

                </div>

            )}

        </main>
    );
}

export default AdminProducts;