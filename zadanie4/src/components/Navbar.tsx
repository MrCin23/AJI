import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';

interface User {
    role: 'KLIENT' | 'PRACOWNIK';
}

const Navbar: React.FC = () => {
    const { user, logout } = useUser();
    const { clearCart } = useCart();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src={process.env.PUBLIC_URL + '/shopping-cart.png'} alt="Logo sklepu" className="d-inline-block align-text-top" />
                    <span className="ms-2">Sklep</span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Lista produktów</NavLink>
                        </li>

                        {user?.role === 'KLIENT' && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/user/cart">Koszyk</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/user/orders">Moje zamówienia</NavLink>
                                </li>
                            </>
                        )}

                        {user?.role === 'PRACOWNIK' && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/staff/orders">Zamówienia</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/init">Inicjalizacja produktów</NavLink>
                                </li>
                            </>
                        )}
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/opinions">Opinie</NavLink>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {user ? (
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={() => { logout(); clearCart(); }}>Wyloguj się</button>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login">Zaloguj się</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/register">Zarejestruj się</NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
