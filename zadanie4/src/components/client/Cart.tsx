import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from "../../api/Axios.ts";

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

    const increaseItemQuantity = (productId: number) => {
        increaseQuantity(productId);
    };

    const decreaseItemQuantity = (productId: number) => {
        decreaseQuantity(productId);
    };

    const removeItemFromCart = (productId: number) => {
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
            setDiffError(`An error occurred while placing your order. ${error}`);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Shopping Cart</h1>

            {cartError && <p className="text-danger">{cartError}</p>}
            {diffError && <p className="text-danger">{diffError}</p>}
            {successMessage && <p className="text-success">{successMessage}</p>}

            <table className="table table-bordered table-hover">
                <thead className="table-light">
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
                        <td>${(item.product.unit_price * item.quantity).toFixed(2)}</td>
                        <td>
                            <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() => decreaseItemQuantity(item.product.id)}
                            >
                                <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <button
                                className="btn btn-success btn-sm me-2"
                                onClick={() => increaseItemQuantity(item.product.id)}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => removeItemFromCart(item.product.id)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="d-flex justify-content-between mb-4">
                <div><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</div>
                <div><strong>Total Weight:</strong> {totalWeight.toFixed(2)} kg</div>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
                <input
                    type="email"
                    className="form-control mb-2"
                    placeholder="Email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                />
                {emailError && <p className="text-danger">{emailError}</p>}

                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                />
                {phoneError && <p className="text-danger">{phoneError}</p>}
            </div>

            <button onClick={handleSubmit} className="btn btn-primary w-100">
                Place Order
            </button>
        </div>
    );
};

export default Cart;
