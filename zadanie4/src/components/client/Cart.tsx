import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from "../../api/Axios.ts";
//
// interface Category {
//     id: string;
//     name: string;
// }

// interface Product {
//     id: number;
//     name: string;
//     description: string;
//     unit_price: number;
//     unit_weight: number;
//     category: Category;
// }

// interface CartItem {
//     product: Product;
//     quantity: number;
// }

interface OrderItem {
    product_id: number;
    quantity: number;
}

interface Order {
    username: string;
    email: string;
    phone_number: string;
    status_id: number;
    ordered_items: OrderItem[];
}

const Cart: React.FC = () => {
    const { cart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCart();
    const [customerName, setCustomerName] = useState<string>('');
    const [customerEmail, setCustomerEmail] = useState<string>('');
    const [customerPhone, setCustomerPhone] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [phoneError, setPhoneError] = useState<string>('');
    const [cartError, setCartError] = useState<string>('');
    const [diffError, setDiffError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const increaseItemQuantity = (productId: string) => {
        increaseQuantity(productId);
    };

    const decreaseItemQuantity = (productId: string) => {
        decreaseQuantity(productId);
    };

    const removeItemFromCart = (productId: string) => {
        removeFromCart(productId);
    };

    const clearAllItems = () => {
        clearCart();
    };

    const totalPrice = cart
        .reduce((total, item) => total + item.product.unit_price * item.quantity, 0);

    const totalWeight = cart
        .reduce((total, item) => total + item.product.unit_weight * item.quantity, 0);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^[\\+]?[0-9]{0,3}[\W\s\\.]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/;
        return phoneRegex.test(phone);

    };

    const handleSubmit = async () => {
        setEmailError('');
        setPhoneError('');
        setCartError('');
        setDiffError('');
        setSuccessMessage('');

        if (!cart.length) {
            setCartError('Your cart is empty.');
            return;
        }

        if (!validateEmail(customerEmail)) {
            setEmailError('Invalid email address.');
            return;
        }

        if (!validatePhone(customerPhone)) {
            setPhoneError('Invalid phone number.');
            return;
        }


        const orderItems: OrderItem[] = cart.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
        }));

        const order: Order = {
            username: customerName,
            email: customerEmail,
            phone_number: customerPhone,
            status_id: 1,
            ordered_items: orderItems,
        };

        try {

            const response = await axios.post('orders', order);


            if (!response.data) {
                throw new Error('Failed to place order.');
            }

            const data = await response.data;
            console.log('Order submitted:', data);

            setSuccessMessage('Order placed successfully!');
            clearAllItems();
        } catch (error) {
            setDiffError('An error occurred while placing your order.');
        }
    };

    return (
        <div className="cart-container">
            <h1>Shopping Cart</h1>

            {cartError && <p className="error">{cartError}</p>}
            {diffError && <p className="error">{diffError}</p>}
            {successMessage && <p className="success">{successMessage}</p>}

            <table>
                <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {cart.map((item) => (
                    <tr key={item.product.id}>
                        <td>{item.product.name}</td>
                        <td>${item.product.unit_price}</td>
                        <td>{item.quantity}</td>
                        <td>${(item.product.unit_price * item.quantity)}</td>
                        <td>
                            <button onClick={() => decreaseItemQuantity(item.product.id)}>
                                <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <button onClick={() => increaseItemQuantity(item.product.id)}>
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                            <button onClick={() => removeItemFromCart(item.product.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="cart-summary">
                <p>Total Price: ${totalPrice}</p>
                <p>Total Weight: {totalWeight} kg</p>
            </div>

            <div className="customer-details">
                <input
                    type="text"
                    placeholder="Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                />
                {emailError && <p className="error">{emailError}</p>}

                <input
                    type="text"
                    placeholder="Phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                />
                {phoneError && <p className="error">{phoneError}</p>}
            </div>

            <button onClick={handleSubmit} className="submit-order">
                Place Order
            </button>
        </div>
    );
};

export default Cart;
