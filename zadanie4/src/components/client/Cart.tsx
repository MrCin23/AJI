import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import { useCart } from '../../contexts/CartContext';
import axios from '../../api/Axios';

// Definicja typu dla zamówienia
interface OrderData {
    confirmationDate: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    products: {
        product: string;
        quantity: number;
        price: number;
    }[];
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
    // const navigate = useNavigate();

    const totalPrice = cart
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2);

    const validatePhone = (phone: string): boolean => /^[0-9]{9}$/.test(phone);
    const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setEmailError('');
        setPhoneError('');
        setCartError('');
        setDiffError('');
        setSuccessMessage('');

        let hasError = false;

        if (cart.length === 0) {
            setCartError('Twój koszyk jest pusty. Dodaj produkty, aby kontynuować.');
            hasError = true;
        }

        if (!validateEmail(customerEmail)) {
            setEmailError('Wprowadź poprawny adres email.');
            hasError = true;
        }

        if (!validatePhone(customerPhone)) {
            setPhoneError('Wprowadź poprawny numer telefonu');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        const orderData: OrderData = {
            confirmationDate: Date.now(),
            customerName,
            customerEmail,
            customerPhone,
            products: cart.map(item => ({
                product: item._id,
                quantity: item.quantity,
                price: item.price,
            })),
        };

        try {
            await axios.post('/orders', orderData);

            setSuccessMessage('Twoje zamówienie zostało pomyślnie złożone! Dziękujemy za zakupy.');

            clearCart();
            // navigate("/");
        } catch (error) {
            console.error('Error placing order:', error);
            setDiffError('Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie później.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Twój koszyk</h2>
            <div className="row">
                <div className="col-md-8 table-responsive">
                    <table className="table table-striped table-hover table-bordered">
                        <thead className="table-dark">
                        <tr className="align-middle text-center">
                            <th>Nazwa</th>
                            <th>Ilość</th>
                            <th>Cena</th>
                            <th>Łączna cena</th>
                            <th>Akcja</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cart.map(item => (
                            <tr key={item._id} className="align-middle text-center">
                                <td className="text-start">{item.name}</td>
                                <td>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <button
                                            className="btn btn-sm btn-secondary me-2"
                                            onClick={() => decreaseQuantity(item._id)}
                                        >
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        {item.quantity}
                                        <button
                                            className="btn btn-sm btn-secondary ms-2"
                                            onClick={() => increaseQuantity(item._id)}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                </td>
                                <td>{item.price.toFixed(2)} zł</td>
                                <td>{(item.price * item.quantity).toFixed(2)} zł</td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => removeFromCart(item._id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                        <span className="ms-2">Usuń</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="col-md-4">
                    <form onSubmit={handleCheckout} className="p-4 border rounded shadow-sm">
                        <h3 className="text-center mb-4">Informacje kontaktowe</h3>
                        <div className="mb-3">
                            <label className="form-label">Imię:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Podaj imię"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email:</label>
                            <input
                                type="email"
                                className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                placeholder="Podaj adres email"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Numer telefonu:</label>
                            <input
                                type="tel"
                                className={`form-control ${phoneError ? 'is-invalid' : ''}`}
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                placeholder="Podaj numer telefonu"
                                required
                            />
                        </div>
                        <hr />
                        <h3 className="text-center mb-4">Cena zamówienia: {totalPrice} zł</h3>
                        {diffError && <div className="alert alert-danger">{diffError}</div>}
                        {emailError && <div className="alert alert-danger">{emailError}</div>}
                        {phoneError && <div className="alert alert-danger">{phoneError}</div>}
                        {cartError && <div className="alert alert-danger">{cartError}</div>}
                        {successMessage && <div className="alert alert-success">{successMessage}</div>}
                        <button
                            type="submit"
                            className="btn btn-success w-100"
                            disabled={!customerName || !customerEmail || !customerPhone}
                        >
                            Złóż zamówienie
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Cart;
