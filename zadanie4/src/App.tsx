import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoutes';

import Login from './components/default/Login';
import Register from './components/default/Register';
import ProductList from './components/default/ListProducts';
// import Opinions from './components/default/Opinions';

import Cart from './components/client/Cart';
import MyOrders from './components/client/MyOrders';

import OrderTable from './components/employee/ListOrders';
import InitDB from './components/employee/InitDB';

const App: React.FC = () => {
    return (
        <UserProvider>
            <CartProvider>
                <Router>
                    <Navbar />
                    <div className="container mt-4">
                        <Routes>
                            <Route path="/" element={<ProductList />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            {/*<Route path="/opinions" element={<Opinions />} />*/}
                            <Route
                                path="/user/cart"
                                element={<ProtectedRoute requiredRole="CLIENT"><Cart /></ProtectedRoute>}
                            />
                            <Route
                                path="/user/orders"
                                element={<ProtectedRoute requiredRole="CLIENT"><MyOrders /></ProtectedRoute>}
                            />
                            <Route
                                path="/staff/orders"
                                element={<ProtectedRoute requiredRole="EMPLOYEE"><OrderTable /></ProtectedRoute>}
                            />
                            <Route
                                path="/init"
                                element={<ProtectedRoute requiredRole="EMPLOYEE"><InitDB /></ProtectedRoute>}
                            />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                </Router>
            </CartProvider>
        </UserProvider>
    );
};

export default App;


