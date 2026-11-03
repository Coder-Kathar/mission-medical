import "./Home.css";
import products from "../data/products";
import { Link } from "react-router-dom";
import OfferSlider from "../components/OfferSlider";
import ScrollReveal from "../components/ScrollReveal";

function Home() {
    // Display only the first 5 products
    const frequentlyRequestedProducts = products.slice(0, 5);

    return (
        <main>
            {/* Hero Section */}
            <ScrollReveal>
                <section className="hero">
                    <div className="hero-content">
                        <div className="hero-text-group">
                            <h1>
                                Your Health,
                                <span>Our Priority</span>
                            </h1>

                            <p>
                                Quality medicines and healthcare products delivered
                                right to your doorstep.
                            </p>

                            <Link to="/products" className="shop-button">
                                Shop Medicines <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </section>
            </ScrollReveal>

            {/* Promotional Offers */}
            <ScrollReveal>
                <OfferSlider />
            </ScrollReveal>

            {/* Categories Section */}
            <ScrollReveal>
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
            </ScrollReveal>

            {/* Frequently Requested Products */}
            <section className="products">
                <ScrollReveal>
                    <h2>Frequently Requested Medicines</h2>
                </ScrollReveal>

                <div className="frequently-requested-container">
                    {frequentlyRequestedProducts.map((product, index) => (
                        <ScrollReveal key={product.id} delay={index * 0.1}>
                            <div className="product-card">
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
                        </ScrollReveal>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Home;