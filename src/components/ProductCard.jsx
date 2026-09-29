import "./ProductCard.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({id, name, price, description, image}){

    const {addToCart} = useContext(CartContext);
    return (
        <div className="product-card">
            <Link to={`/products/${id}`}>
                <img src={image} 
                     alt={name}
                     className="product-image" />
                <h3>{name}</h3>
            </Link>

            <p>{description}</p>

            <p className="product-price">₹{price}</p>

            <button onClick={() => addToCart({id, name, price, description, image})}>Add to Cart</button>
        </div>
    );
}

export default ProductCard;