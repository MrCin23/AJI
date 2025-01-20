import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faPen } from '@fortawesome/free-solid-svg-icons';

import axios from '../../api/Axios';
import { useCart } from '../../contexts/CartContext';
import { useUser } from '../../contexts/UserContext';

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

const ListProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [filter, setFilter] = useState({ name: '', category: '' });
    const [categories, setCategories] = useState<Category[]>([]);
    const navigate = useNavigate();
    const { addToCart, cart } = useCart();
    const { user } = useUser();

    useEffect(() => {
        axios
            .get<Product[]>('/products')
            .then((response) => {
                setProducts(response.data);
                setFilteredProducts(response.data);
            })
            .catch((error) => console.error('Error fetching products:', error));
    }, []);

    useEffect(() => {
        axios
            .get<Category[]>('/categories')
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => console.error('Error fetching categories:', error));
    }, []);

    const filterProducts = () => {
        let result = products;
        if (filter.name) {
            result = result.filter((p) => p.name.toLowerCase().includes(filter.name.toLowerCase()));
        }
        if (filter.category) {
            result = result.filter((p) => p.category.name.toLowerCase() === filter.category.toLowerCase());
        }
        setFilteredProducts(result);
    };

    const editProduct = (id: string) => {
        navigate('/staff/edit/' + id);
    };

    const handleAddToCart = (product: Product) => {
        addToCart(product);
    };

    const isProductInCart = (productId: string): boolean => {
        return cart.some((item: Product) => item.id === productId);
    };

    useEffect(() => {
        filterProducts();
    }, [filter]);

    return (
        <div className="container">
            <h2 className="my-4 text-center">Lista produktów</h2>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Filtruj po nazwie produktu"
                        value={filter.name}
                        onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                    />
                </div>
                <div className="col-md-6">
                    <select
                        className="form-select"
                        value={filter.category}
                        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                    >
                        <option value="">Wszystkie kategorie</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered">
                    <thead className="table-dark text-center">
                    <tr className="align-middle">
                        <th>Nazwa</th>
                        <th>Opis</th>
                        <th>Cena</th>
                        <th>Akcja</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product.id} className="align-middle">
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td className="text-center">{product.unit_price} zł</td>
                            <td className="text-center">
                                {!user ? (
                                    <span>Zaloguj się, aby wykonać akcję</span>
                                ) : (
                                    <>
                                        {user?.role === 'CLIENT' && (
                                            <button
                                                className={`btn btn-sm ${
                                                    isProductInCart(product.id) ? 'btn-success' : 'btn-primary'
                                                }`}
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                <FontAwesomeIcon icon={faCartShopping} />
                                                <span className="ms-2">
                                                        {isProductInCart(product.id) ? 'Dodano' : 'Dodaj do koszyka'}
                                                    </span>
                                            </button>
                                        )}
                                        {user?.role === 'EMPLOYEE' && (
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => editProduct(product.id)}
                                            >
                                                <FontAwesomeIcon icon={faPen} />
                                                <span className="ms-2">Edytuj</span>
                                            </button>
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListProducts;
