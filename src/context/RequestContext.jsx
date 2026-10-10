import { createContext, useState } from "react";

export const RequestContext = createContext();

export function RequestProvider({ children }){
    const [requestItems, setRequestItems] = useState([]);

    const addToRequest = (product, quantity, quantityType) => {
        setRequestItems((currentItems) => {
            const existingIndex = currentItems.findIndex(
                (item) =>
                    item.id === product.id &&
                    item.quantityType === quantityType
            );

            if (existingIndex !== -1) {
                return currentItems.map((item, index) =>
                    index === existingIndex
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [
                ...currentItems,
                { ...product, quantity, quantityType }
            ];
        });
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
                setRequestItems,
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