import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout(){

    const {cart, clearCart} = useContext(CartContext);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");

    const navigate = useNavigate();

    const totalPrice = cart.reduce(
        (total, product) => 
            total + product.price * product.quantity, 
        0
    );

    if(cart.length === 0){
        return(
            <main>
                <h1>Your cart is Empty</h1>
                <p>Please add some products before checkout.</p>
            </main>
        );
    }

    const handlePlaceOrder = () => {

        if(
            name.trim() === "" ||
            phone.trim() === "" ||
            address.trim() === "" ||
            city.trim() === "" ||
            pincode.trim() === "" 
        ){
            alert("Please fill in all delivery details.");
            return;
        }

        if(!/^[A-Za-z ]+$/.test(name)){
            alert("Name should contain only letters.");
            return;
        }

        if(!/^[A-Za-z ]+$/.test(city)){
            alert("City should contain only letters.");
            return;
        }

        if(!/^\d{10}$/.test(phone)){
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        if(!/^\d{6}$/.test(pincode)){
            alert("Please enter a valid 6-digit pincode.");
            return;
        }
        const order = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            products : cart,
            total : totalPrice,
            name : name,
            phone : phone,
            address : address,
            city : city,
            pincode : pincode,
            status : "Order Placed",
        };

        const existingOrders = 
        JSON.parse(localStorage.getItem("orders")) || [] ;
        
        existingOrders.push(order);
        
        localStorage.setItem("orders", JSON.stringify(existingOrders));

        clearCart();

        alert("Order placed successfully");
        
        navigate("/orders", {
            state: {order}
        });
    };

    return (
        <main className="checkout-page">
            <h1>Checkout</h1>

            <section className="checkout-section">
                <h2>Order Summary</h2>

                {cart.map((product) => (
                    <div key={product.id} className="order-item">
                        <h3>{product.name}</h3>
                        <p>
                            ₹{product.price} * {product.quantity}
                        </p>
                        <p>
                            Subtotal: ₹{product.price * product.quantity}   
                        </p>
                    </div>
                ))}

                <div className="order-total">
                    <h2>Total : ₹{totalPrice}</h2>
                </div>
            </section>

            <section className="checkout-section">
                <h2>Delivery Address</h2>

                <form className="checkout-form">

                    <input type="text" 
                            placeholder="Full Name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}/>

                    <input type="text" 
                            placeholder="Phone Number" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}/>
                    
                    <textarea placeholder="Delivery Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}></textarea>
                
                    <input type="text" 
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)} />

                    <input type="text" 
                            placeholder="Pincode"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}/>

                </form>
            </section>

            <section className="checkout-section">
                <h2>Payment Method</h2>

                <div className="payment-option">
                    <label>
                        <input type="radio"
                                name="payment"
                                value="cod"
                                defaultChecked />
                        Cash on Delivery
                    </label>
                </div>
            </section>
            <button className="place-order-button" type="button" onClick={handlePlaceOrder}>
                Place Order
            </button>
        </main>
    );
}

export default Checkout;