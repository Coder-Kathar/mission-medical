import { createContext, useState } from "react";
import initialProducts from "../data/products";

export const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState(initialProducts);

    const addProduct = (newProduct) => {
        setProducts((currentProducts) => [
            ...currentProducts,
            {
                ...newProduct,
                id: Date.now(),
            },
        ]);
    };

    const deleteProduct = (productId) => {
        setProducts((currentProducts) =>
            currentProducts.filter((product) => product.id !== productId)
        );
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
}
