// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from '../../api/Axios';
//
// interface Product {
//     id: string;
//     name: string;
//     description: string;
//     unit_price: number;
//     unit_weight: number;
//     categoryid: string;
//     category: string;
// }
//
// interface ErrorMessages {
//     name?: string;
//     description?: string;
//     price?: string;
//     weight?: string;
//     category?: string;
//     general?: string;
// }
//
// interface ValidationState {
//     name: boolean;
//     description: boolean;
//     price: boolean;
//     weight: boolean;
//     category: boolean;
// }
//
// const EditProduct: React.FC = () => {
//     const { id } = useParams<{ id: string }>();
//     const [product, setProduct] = useState<Product>({
//         id: '',
//         name: '',
//         description: '',
//         unit_price: 0,
//         unit_weight: 0,
//         categoryid: '',
//         category: ''
//     });
//     const [categories, setCategories] = useState<Category[]>([]);
//     const [errorMessages, setErrorMessages] = useState<ErrorMessages>({});
//     // const [validationState, setValidationState] = useState<ValidationState>({
//     //     name: true,
//     //     description: true,
//     //     price: true,
//     //     weight: true,
//     //     category: true
//     // });
//     const [successMessage, setSuccessMessage] = useState<string>('');
//
//     useEffect(() => {
//         axios.get(`/products/${id}`)
//             .then(response => {
//                 setProduct(response.data);
//             })
//             .catch(error => {
//                 console.error('There was an error fetching the product!', error);
//             });
//     }, [id]);
//
//     useEffect(() => {
//         axios.get('/categories')
//             .then(response => {
//                 setCategories(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching categories', error);
//             });
//     }, []);
//
//     const fetchSeoDescription = () => {
//         axios.get(`/products/${id}/seo-description`)
//             .then(response => {
//                 setProduct({ ...product, description: response.data.seoDescription });
//             })
//             .catch(error => {
//                 console.error('Error fetching SEO description', error);
//             });
//     };
//
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setProduct({ ...product, [name]: value });
//     };
//
//     const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         setProduct({ ...product, category: e.target.value });
//     };
//
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//
//         setErrorMessages({});
//         setSuccessMessage('');
//
//         try {
//             await axios.put(`/products/${id}`, product);
//             setSuccessMessage('Produkt został pomyślnie zaktualizowany.');
//         } catch (error: any) {
//             if (error.response && error.response.data.detail) {
//                 if (Array.isArray(error.response.data.detail)) {
//                     const errors = error.response.data.detail.reduce((acc: any, err: any) => {
//                         acc[err.field] = err.message;
//                         return acc;
//                     }, {});
//                     setErrorMessages(errors);
//                 } else {
//                     setErrorMessages({ general: error.response.data.detail });
//                 }
//
//                 setValidationState((prevState) => {
//                     const updatedValidationState = { ...prevState };
//                     if (Array.isArray(error.response.data.detail)) {
//                         error.response.data.detail.forEach((err: any) => {
//                             updatedValidationState[err.field] = false;
//                         });
//                     }
//                     return updatedValidationState;
//                 });
//             } else {
//                 setErrorMessages({ general: 'Wystąpił błąd podczas aktualizacji produktu. Spróbuj ponownie później.' });
//             }
//         }
//     };
//
//     return (
//         <div className="container mt-5">
//             <h2>Edytuj produkt</h2>
//     <form onSubmit={handleSubmit}>
//     <div className="mb-3">
//     <label htmlFor="name" className="form-label">Nazwa</label>
//         <input
//     type="text"
//     className={`form-control ${errorMessages.name ? 'is-invalid' : ''}`}
//     id="name"
//     name="name"
//     value={product.name}
//     onChange={handleInputChange}
//     required
//     />
//     {errorMessages.name && <div className="invalid-feedback">{errorMessages.name}</div>}
//             </div>
//             <div className="mb-3">
//         <label htmlFor="description" className="form-label">Opis</label>
//         <div className="input-group">
//         <textarea
//             className={`form-control ${errorMessages.description ? 'is-invalid' : ''}`}
//     id="description"
//     name="description"
//     value={product.description}
//     onChange={handleInputChange}
//     required
//     />
//     <button
//         type="button"
//     className="btn btn-info"
//     onClick={fetchSeoDescription}
//         >
//         Wygeneruj opis SEO
//     </button>
//     </div>
//     {errorMessages.description && <div className="invalid-feedback">{errorMessages.description}</div>}
//         </div>
//         <div className="mb-3">
//     <label htmlFor="price" className="form-label">Cena</label>
//         <input
//         type="number"
//         className={`form-control ${errorMessages.price ? 'is-invalid' : ''}`}
//         id="price"
//         name="price"
//         value={product.price}
//         onChange={handleInputChange}
//         required
//         />
//         {errorMessages.price && <div className="invalid-feedback">{errorMessages.price}</div>}
//                 </div>
//                 <div className="mb-3">
//             <label htmlFor="weight" className="form-label">Waga [kg]</label>
//             <input
//             type="number"
//             className={`form-control ${errorMessages.weight ? 'is-invalid' : ''}`}
//         id="weight"
//         name="weight"
//         value={product.weight}
//         onChange={handleInputChange}
//         required
//         />
//         {errorMessages.weight && <div className="invalid-feedback">{errorMessages.weight}</div>}
//                 </div>
//                 <div className="mb-3">
//             <label htmlFor="category" className="form-label">Kategoria</label>
//             <select
//             className={`form-control ${errorMessages.category ? 'is-invalid' : ''}`}
//         id="category"
//         name="category"
//         value={product.category}
//         onChange={handleCategoryChange}
//         required
//         >
//         {categories.map((category) => (
//                 <option key={category._id} value={category.name}>
//             {category.name}
//             </option>
//     ))}
//         </select>
//         {errorMessages.category && <div className="invalid-feedback">{errorMessages.category}</div>}
//             </div>
//             <button type="submit" className="btn btn-primary">Zapisz zmiany</button>
//         </form>
//             {errorMessages.general && (
//                 <div className="alert alert-danger">{errorMessages.general}</div>
//             )}
//             {successMessage && (
//                 <div className="alert alert-success" role="alert">
//                 {successMessage}
//                 </div>
//             )}
//             </div>
//         );
//         };
//
//         export default EditProduct;
