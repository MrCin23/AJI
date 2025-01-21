import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface Product {
    id: number;
    name: string;
    description: string;
    unit_price: number;
    unit_weight: number;
    category: Category;
}

interface Category {
    id: string;
    name: string;
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    increaseQuantity: (id: number) => void;
    decreaseQuantity: (id: number) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
}

interface CartProviderProps {
    children: ReactNode;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const storedCart = Cookies.get('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    const saveCartToCookie = (cart: CartItem[]) => {
        Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
    };

    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item.product.id === product.id);
        let updatedCart;
        if (existingItem) {
            updatedCart = cart.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            updatedCart = [...cart, { product, quantity: 1 }];
        }
        setCart(updatedCart);
        saveCartToCookie(updatedCart);
    };

    const increaseQuantity = (id: number) => {
        const updatedCart = cart.map(item =>
            item.product.id === id
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );
        setCart(updatedCart);
        saveCartToCookie(updatedCart);
    };

    const decreaseQuantity = (id: number) => {
        const updatedCart = cart
            .map(item =>
                item.product.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            .filter(item => item.quantity > 0);
        setCart(updatedCart);
        saveCartToCookie(updatedCart);
    };

    const removeFromCart = (id: number) => {
        const updatedCart = cart.filter(item => item.product.id !== id);
        setCart(updatedCart);
        saveCartToCookie(updatedCart);
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

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
