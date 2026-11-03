import "./Products.css";
import "../RequestButton.css";
import ProductCard from "../components/ProductCard";
import ScrollReveal from "../components/ScrollReveal";

import { useContext, useState, useEffect } from "react";
import { ProductContext } from "../context/ProductContext";
import { useSearchParams, useNavigate } from "react-router-dom";

function Products() {
    const { products } = useContext(ProductContext);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const searchTerm = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const [currentPage, setCurrentPage] = useState(1);

    const productsPerPage = 12;

    // Reset pagination when search or category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, category]);

    // Search and category filtering
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesCategory =
            category === "" || product.category === category;

        return matchesSearch && matchesCategory;
    });

    // Pagination calculations
    const totalPages = Math.ceil(
        filteredProducts.length / productsPerPage
    );

    const lastProductIndex = currentPage * productsPerPage;
    const firstProductIndex = lastProductIndex - productsPerPage;

    const currentProducts = filteredProducts.slice(
        firstProductIndex,
        lastProductIndex
    );

    return (
        <main className="products-page">

            {/* Page Heading */}
            <ScrollReveal>
                <h1>All Products</h1>

                <p>
                    Browse our medicines and our healthcare products.
                </p>
            </ScrollReveal>

            {/* Clear Search Button */}
            {searchTerm && (
                <ScrollReveal>
                    <button
                        className="clear-search-button"
                        onClick={() => navigate("/products")}
                    >
                        Clear Search
                    </button>
                </ScrollReveal>
            )}

            {/* Product Listing */}
            <div className="product-container">
                {currentProducts.length > 0 ? (
                    currentProducts.map((product, index) => (
                        <ScrollReveal
                            key={product.id}
                            delay={index * 0.05}
                        >
                            <ProductCard {...product} />
                        </ScrollReveal>
                    ))
                ) : (
                    <ScrollReveal>
                        <p>No Products Found.</p>
                    </ScrollReveal>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <ScrollReveal>
                    <div className="pagination">

                        <button
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage((prev) => prev - 1)
                            }
                        >
                            Previous
                        </button>

                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                        ).map((page) => (
                            <button
                                key={page}
                                className={
                                    currentPage === page ? "active" : ""
                                }
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() =>
                                setCurrentPage((prev) => prev + 1)
                            }
                        >
                            Next
                        </button>

                    </div>
                </ScrollReveal>
            )}

        </main>
    );
}

export default Products;