import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./Cart.css";
import { Link } from "react-router-dom";

function Cart(){

    const { cart, 
            increaseQuantity, 
            decreaseQuantity,
            removeFromCart,} = useContext(CartContext);

    const totalPrice = cart.reduce(
        (total, product) => 
            total + product.price * product.quantity,
        0
    );
    return (
        <main className="cart-page">
            <h1>Shopping Cart</h1>

            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    {cart.map((product) => (
                        <div className="cart-item" key={product.id}> 
                            
                            <div className="cart-item-info">
                                <img src={product.image} alt={product.name} className="cart-product-image" />
                                <div>
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>

                                    <p>₹{product.price} × {product.quantity}</p>
                                    <p className="cart-subtotal">
                                        Subtotal: ₹{product.price * product.quantity}
                                    </p>
                                </div>
                            </div>

                            <div className="cart-actions">
                                <div className="quantity-controls">
                                    <button onClick={() => decreaseQuantity(product.id)}>-</button>

                                    <span>{product.quantity}</span>

                                    <button onClick={() => increaseQuantity(product.id)}>+</button>
                                </div>

                                <button className="remove-button" 
                                        onClick={() => removeFromCart(product.id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                    <div className="cart-total">
                        <h2>Total: ₹{totalPrice}</h2>  
                        <Link to="/checkout" className="checkout-button">Proceed to Checkout</Link>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Cart;