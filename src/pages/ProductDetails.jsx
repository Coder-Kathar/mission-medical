import { useParams, Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import products from "../data/products";
import "./ProductDetails.css";
import { useState } from "react";

function ProductDetails(){

    const [quantity, setQuantity] = useState(1);

    const {id} = useParams();

    const {addToCart} = useContext(CartContext);

    const product = products.find(
        (product) => product.id === Number(id)
    );

    if(!product){
        return (
            <main>
                <h1>Product Not Found</h1>
                <p>The product you are looking for does not exist.</p>
            </main>
        );
    }
    return (
        <main className="product-details">

            <Link to="/products" className="back-link">
                ← Back to Products
            </Link>

            <img src={product.image} alt={product.name} className="product-details-image"/>

            <div className="product-details-info">

                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <p className="product-details-price">₹{product.price}</p>

                <div className="quantity-controls">
                    
                    <button onClick={() => {
                        if(quantity > 1){
                            setQuantity(quantity-1);
                        }
                    }}>-</button>

                    <span>{quantity}</span>

                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>

                <button onClick={() => addToCart(product, quantity)}>
                        Add to Cart
                </button>
            </div>
        </main>
    );
}

export default ProductDetails;