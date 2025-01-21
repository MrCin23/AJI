import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';

const Navbar: React.FC = () => {
    const { user, logout } = useUser();
    const { clearCart } = useCart();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img
                        src={"./cpu_icon.png"}
                        height="48"
                        width="48"
                        alt="Logo sklepu"
                        className="d-inline-block invert-img me-2"
                    />
                    <span className="fs-5">Sklep z częściami komputerowymi</span>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Lista produktów</NavLink>
                        </li>

                        {user?.role === 'CLIENT' && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/user/cart">Koszyk</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/user/orders">Moje zamówienia</NavLink>
                                </li>
                            </>
                        )}

                        {user?.role === 'EMPLOYEE' && (
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
                                <button
                                    className="btn btn-link nav-link text-decoration-none"
                                    onClick={() => {
                                        logout();
                                        clearCart();
                                    }}
                                >
                                    Wyloguj się
                                </button>
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