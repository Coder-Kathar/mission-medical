import "./Home.css";
import products from "../data/products";
import { Link } from "react-router-dom";

function Home(){

    return (
        <main>

            {/* This is beginning view of page */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Your Health, Our Priority</h1>

                    <p>
                        Quality medicines and healthcare products delivered 
                        right to your doorstep.
                    </p>

                    <Link to="/products" className="shop-button">Shop Medicines</Link>
                </div>
            </section>

            {/* Divied by Categories */}
            <section className="categories">
                <h2>Shop by Category</h2>

                <div className="category-container">
                    <Link to="/products?category=medicines" className="category-card">
                        <h3>Medicines</h3>
                        <p>Essential medicines</p>
                    </Link>
                    <Link to="/products?category=vitamins" className="category-card">
                        <h3>Vitamins & Supplements</h3>
                        <p>Support your health</p>
                    </Link>
                    <Link to="/products?category=personal-care" className="category-card">
                        <h3>Personal Care</h3>
                        <p>Everyday personal care</p>
                    </Link>
                    <Link to="/products?category=baby-care" className="category-card">
                        <h3>Baby Care</h3>
                        <p>Products for your little ones</p>
                    </Link>
                </div>
            </section>

            {/* Popular Products */}
            <section className="products">
                <h2>Frequently Requested Medicines</h2>

                <div className="product-container">
                    {products.map((product) => (
                        <div className="product-card" key={product.id}>
                            <h3>{product.name}</h3>

                            <p>
                                {product.description || "Healthcare product"}
                            </p>

                            <Link
                                to={`/products/${product.id}`}
                                className="shop-button"
                            >
                                View Product
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Home;