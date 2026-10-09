import { createContext, useState } from "react";

export const RequestContext = createContext();

export function RequestProvider({ children }){
    const [requestItems, setRequestItems] = useState([]);

    const addToRequest = (product, quantity, quantityType) => {

        const item = {
            ...product,
            quantity,
            quantityType
        };

        setRequestItems((currentItems) => [
            ...currentItems,
            item
        ]);
    };

    const removeFromRequest = (index) => {
        setRequestItems((currentItems) => 
            currentItems.filter((_, itemIndex) => itemIndex !== index)
        );
    };

    const updateRequestQuantity = (index, newQuantity) => {
        if(newQuantity < 1) return;

        setRequestItems((currentItems) => 
            currentItems.map((item, itemIndex) =>
                itemIndex === index 
                ? {...item, quantity: newQuantity} 
                : item
            )
        );
    };

    const clearRequest = () => {
        setRequestItems([]);
    };

    return (
        <RequestContext.Provider
            value={{
                requestItems,
                addToRequest,
                removeFromRequest,
                updateRequestQuantity,
                clearRequest
            }}
        >
            {children}
        </RequestContext.Provider>
    );
}