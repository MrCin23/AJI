import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/Axios';  // Adjust the path based on your setup

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
    // const history = useHistory();

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

    // Fetch product details and categories
    useEffect(() => {
        // Fetch product data by ID
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

        // Fetch categories
        axios.get('/categories')
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, [id]);

    // Validation functions
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Run validation before submitting
        const isValidName = validateName();
        const isValidPrice = validatePrice();
        const isValidWeight = validateWeight();
        const isValidCategory = validateCategory();

        if (!(isValidName && isValidPrice && isValidWeight && isValidCategory)) {
            return;  // Stop submission if validation fails
        }

        const updatedProduct = {
            name,
            description,
            unit_price: +unitPrice,
            unit_weight: +unitWeight,
            category_id: +selectedCategory,  // Assuming category is selected by ID
        };

        try {
            // Send PUT request to update the product
            const response = await axios.put(`/products/${id}`, updatedProduct);
            console.log('Product updated successfully:', response.data);

            // Redirect to product detail page or list after update
            // history.push(`/products/${id}`);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div className="edit-product-container">
            <h1>Edit Product</h1>

            {product ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={validateName}
                        />
                        {nameError && <p className="error">{nameError}</p>}
                    </div>

                    <div>
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="unitPrice">Price:</label>
                        <input
                            type="number"
                            id="unitPrice"
                            value={unitPrice}
                            onChange={(e) => setUnitPrice(Number(e.target.value))}
                            onBlur={validatePrice}
                        />
                        {priceError && <p className="error">{priceError}</p>}
                    </div>

                    <div>
                        <label htmlFor="unitWeight">Weight:</label>
                        <input
                            type="number"
                            id="unitWeight"
                            value={unitWeight}
                            onChange={(e) => setUnitWeight(Number(e.target.value))}
                            onBlur={validateWeight}
                        />
                        {weightError && <p className="error">{weightError}</p>}
                    </div>

                    <div>
                        <label htmlFor="category">Category:</label>
                        <select
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
                        {categoryError && <p className="error">{categoryError}</p>}
                    </div>

                    <button type="submit">Save Changes</button>
                </form>
            ) : (
                <p>Loading product...</p>
            )}
        </div>
    );
};

export default EditProduct;
