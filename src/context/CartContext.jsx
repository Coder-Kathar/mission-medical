import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

function CartProvider({children}){
    
    const [cart, setCart] = useState(
        JSON.parse(localStorage.getItem("cart")) || []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        const existingProduct = cart.find(
            (item) => item.id === product.id
        );

        if(existingProduct){
            setCart(
                cart.map((item) => 
                    item.id === product.id
                        ? {...item, quantity: item.quantity + quantity}
                        : item
                )
            );
        }else{
            setCart([...cart, {...product, quantity: quantity}]);
        }
    };
    
    const increaseQuantity = (id) => {
        setCart(
            cart.map((item) =>
                item.id === id
                    ? {...item, quantity: item.quantity + 1}
                    : item 
            )
        );
    };

    const decreaseQuantity = (id) => {
        setCart(
            cart.map((item) =>
                item.id === id && item.quantity > 1
                    ? {...item, quantity: item.quantity - 1}
                    : item 
            )
        );
    };

    const removeFromCart = (id) => {
        setCart(
            cart.filter((item) => item.id !== id)
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider 
            value={{
                cart, 
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart
            }}>
            {children}
        </CartContext.Provider>
    );
}

export default CartProvider;