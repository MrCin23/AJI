import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

// Typ reprezentujący pojedynczy element w koszyku
interface Product {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    [key: string]: any; // Opcjonalne dodatkowe pola
}

// Typy kontekstu koszyka
interface CartContextType {
    cart: Product[];
    addToCart: (product: Product) => void;
    increaseQuantity: (_id: string) => void;
    decreaseQuantity: (_id: string) => void;
    removeFromCart: (_id: string) => void;
    clearCart: () => void;
}

// Typy dla komponentu CartProvider
interface CartProviderProps {
    children: ReactNode;
}

// Tworzenie kontekstu z typowaniem
const CartContext = createContext<CartContextType | undefined>(undefined);

// Komponent dostarczający kontekst
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<Product[]>([]);

    useEffect(() => {
        const storedCart = Cookies.get('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    const saveCartToCookie = (cart: Product[]) => {
        Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
    };

    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item._id === product._id);
        let updatedCart: Product[];

        if (existingItem) {
            updatedCart = cart.map(item =>
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            updatedCart = [...cart, { ...product, quantity: 1 }];
        }

        setCart(updatedCart);
        saveCartToCookie(updatedCart);
    };

    const updateProduct = (_id: string, quantity: number) => {
        const updatedCart = cart.map(item =>
            item._id === _id ? { ...item, quantity } : item
        );
        setCart(updatedCart);
        saveCartToCookie(updatedCart);
    };

    const removeFromCart = (_id: string) => {
        const updatedCart = cart.filter(item => item._id !== _id);
        setCart(updatedCart);
        saveCartToCookie(updatedCart);
    };

    const increaseQuantity = (_id: string) => {
        const item = cart.find(item => item._id === _id);
        if (item) {
            updateProduct(_id, item.quantity + 1);
        }
    };

    const decreaseQuantity = (_id: string) => {
        const item = cart.find(item => item._id === _id);
        if (item) {
            const newQuantity = item.quantity - 1;
            if (newQuantity > 0) {
                updateProduct(_id, newQuantity);
            } else {
                removeFromCart(_id); // Usuń produkt, jeśli ilość spadnie do zera
            }
        }
    };

    const clearCart = () => {
        setCart([]);
        Cookies.remove('cart');
    };

    return (
        <CartContext.Provider
            value={{ cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Hook do używania kontekstu koszyka
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
