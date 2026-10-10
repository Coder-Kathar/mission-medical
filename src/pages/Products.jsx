import "./Products.css";
import ProductCard from "../components/ProductCard";
import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import { useSearchParams, useNavigate } from "react-router-dom";

function Products(){

    const {products} = useContext(ProductContext);

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const searchTerm = searchParams.get("search") || "";

    const category = searchParams.get("category") || "";

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase());
                            
        const matchesCategory = category === "" || product.category === category;

        return matchesSearch && matchesCategory;
    });

    return (
        <main className="products-page">
            <h1>All Products</h1>

            <p>Browse our medicines and our healthcare products.</p>

            {searchTerm && (
                <button onClick={() => navigate("/products")}>Clear Search</button>
            )}

            <div className="product-container">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            description={product.description}
                            image={product.image}
                        />
                    )) 
                    ) : (
                        <p>No Products Found.</p>
                    )
                }
            </div>
        </main>
    );
}

export default Products;