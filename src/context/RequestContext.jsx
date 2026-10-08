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

    return (
        <RequestContext.Provider
            value={{
                requestItems,
                addToRequest,
                removeFromRequest
            }}
        >
            {children}
        </RequestContext.Provider>
    );
}