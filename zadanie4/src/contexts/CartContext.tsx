import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface Product {
    id: string;
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

interface CartContextType {
    cart: Product[];
    addToCart: (product: Product) => void;
    increaseQuantity: (id: string) => void;
    decreaseQuantity:(id: string) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
}

interface CartProviderProps {
    children: ReactNode;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

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
        let updatedCart: Product[];
        const item = cart.find(item => item.id === product.id);
        if(item){
            updatedCart = [...cart, { ...item }];
            setCart(updatedCart);
            saveCartToCookie(updatedCart);
        } else {
            throw new Error("Cannot find product");
        }
    };

    // const updateProduct = (id: string, quantity: number) => {
    //     const updatedCart = cart.map(item =>
    //         item.id === id ? { ...item, quantity } : item
    //     );
    //     setCart(updatedCart);
    //     saveCartToCookie(updatedCart);
    // };

    const removeFromCart = (id: string) => {
        const updatedCart = cart.filter(item => item.id !== id);
        setCart(updatedCart);
        saveCartToCookie(updatedCart);
    };

    const increaseQuantity = (id: string) => {
        const item = cart.find(item => item.id === id);
        addToCart(item!)
    };

    const decreaseQuantity = (id: string) => {
        removeFromCart(id)
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
