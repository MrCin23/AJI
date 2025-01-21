import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/Axios';

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    unit_price: number;
    unit_weight: number;
    category_id: Category;
}

const EditProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [unitPrice, setUnitPrice] = useState<number>(0);
    const [unitWeight, setUnitWeight] = useState<number>(0);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const [nameError, setNameError] = useState<string>('');
    const [priceError, setPriceError] = useState<string>('');
    const [weightError, setWeightError] = useState<string>('');
    const [categoryError, setCategoryError] = useState<string>('');

    useEffect(() => {
        axios.get(`/products/${id}`)
            .then((response) => {
                const fetchedProduct = response.data;
                setProduct(fetchedProduct);
                setName(fetchedProduct.name);
                setDescription(fetchedProduct.description);
                setUnitPrice(fetchedProduct.unit_price);
                setUnitWeight(fetchedProduct.unit_weight);
                setSelectedCategory(fetchedProduct.category.id);
            })
            .catch((error) => {
                console.error('Error fetching product:', error);
            });

        axios.get('/categories')
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, [id]);

    const validateName = () => {
        if (name.trim() === '') {
            setNameError('Name is required');
            return false;
        }
        setNameError('');
        return true;
    };

    const validatePrice = () => {
        if (unitPrice <= 0) {
            setPriceError('Price must be a positive number');
            return false;
        }
        setPriceError('');
        return true;
    };

    const validateWeight = () => {
        if (unitWeight <= 0) {
            setWeightError('Weight must be a positive number');
            return false;
        }
        setWeightError('');
        return true;
    };

    const validateCategory = () => {
        if (selectedCategory === '') {
            setCategoryError('Category is required');
            return false;
        }
        setCategoryError('');
        return true;
    };

    const descriptionHandler = async (id: number) => {
        try {
            const response = await axios.get(`/products/${id}/smart-description`);
            setDescription(response.data);
        } catch (error) {
            console.error('Error generating smart description:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isValidName = validateName();
        const isValidPrice = validatePrice();
        const isValidWeight = validateWeight();
        const isValidCategory = validateCategory();

        if (!(isValidName && isValidPrice && isValidWeight && isValidCategory)) {
            return;
        }

        const updatedProduct = {
            name,
            description,
            unit_price: +unitPrice,
            unit_weight: +unitWeight,
            category_id: +selectedCategory,
        };

        try {
            const response = await axios.put(`/products/${id}`, updatedProduct);
            console.log('Product updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Edit Product</h1>

            {product ? (
                <form onSubmit={handleSubmit} className="needs-validation">
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name:</label>
                        <input
                            type="text"
                            className={`form-control ${nameError ? 'is-invalid' : ''}`}
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={validateName}
                        />
                        {nameError && <div className="invalid-feedback">{nameError}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description:</label>
                        <textarea
                            className="form-control"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                        <button
                            type="button"
                            className="btn btn-outline-secondary mt-2"
                            onClick={() => descriptionHandler(product.id)}
                        >
                            Generate Smart Description
                        </button>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="unitPrice" className="form-label">Price:</label>
                        <input
                            type="number"
                            className={`form-control ${priceError ? 'is-invalid' : ''}`}
                            id="unitPrice"
                            value={unitPrice}
                            onChange={(e) => setUnitPrice(Number(e.target.value))}
                            onBlur={validatePrice}
                        />
                        {priceError && <div className="invalid-feedback">{priceError}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="unitWeight" className="form-label">Weight:</label>
                        <input
                            type="number"
                            className={`form-control ${weightError ? 'is-invalid' : ''}`}
                            id="unitWeight"
                            value={unitWeight}
                            onChange={(e) => setUnitWeight(Number(e.target.value))}
                            onBlur={validateWeight}
                        />
                        {weightError && <div className="invalid-feedback">{weightError}</div>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="category" className="form-label">Category:</label>
                        <select
                            className={`form-select ${categoryError ? 'is-invalid' : ''}`}
                            id="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            onBlur={validateCategory}
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {categoryError && <div className="invalid-feedback">{categoryError}</div>}
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Save Changes</button>
                </form>
            ) : (
                <p>Loading product...</p>
            )}
        </div>
    );
};

export default EditProduct;
