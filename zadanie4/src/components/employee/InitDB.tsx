import React, { useState, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import axios from '../../api/Axios';
import {AxiosError} from "axios";

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

const InitDB: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');

    const validateJsonStructure = (jsonData: Product[]): string | null => {
        if (!Array.isArray(jsonData)) {
            return 'Error reading jason';
        }

        for (let i = 0; i < jsonData.length; i++) {
            const product = jsonData[i];

            if (!product.name) {
                return `Error: Produkt ${i + 1} missing or incorrect name.`;
            }
            if (!product.description) {
                return `Error: Produkt ${i + 1} - Brak lub nieprawidłowy description.`;
            }
            if (product.unit_price <= 0 || product.unit_price >= 200000) {
                return `Error: Produkt ${i + 1} missing or incorrect price.`;
            }
            if (product.unit_weight <= 0 || product.unit_weight >= 2137) {
                return `Error: Produkt ${i + 1} missing or incorrect weight.`;
            }
        }
        return null;
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && selectedFile.type === "application/json") {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const jsonData: Product[] = JSON.parse(e.target?.result as string);
                    const validationError = validateJsonStructure(jsonData);
                    if (validationError) {
                        setError(validationError);
                        setFile(null);
                    } else {
                        setFile(selectedFile);
                        setError('');
                        setMessage('');
                    }
                } catch (err) {
                    setError(`Error: jason did not pass validation :( ${err}`);
                    setFile(null);
                }
            };
            reader.readAsText(selectedFile);
        } else {
            setError('Error: only jason files!!');
            setFile(null);
        }
    };

    const handleSubmit = async () => {
        setError('');
        setMessage('');

        if (!file) {
            setError('Select jason file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('/init', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage("Product initialisation finished successfully");
        } catch (error) {
            if(error instanceof AxiosError) {
                if (error.response && error.response.data && error.response.data.detail) {
                    if (error.response.data.detail === 'Database contains items.') {
                        setError('Database contains items, initialisation failed');
                    } else {
                        setError(error.response.data.detail);
                    }
                } else {
                    setError('An error occurred while initialising data');
                }
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Inicjalizacja Bazy Danych</h2>

            <div className="mb-3">
                <label htmlFor="fileInput" className="form-label">Wybierz plik JSON:</label>
                <input
                    type="file"
                    className="form-control"
                    id="fileInput"
                    accept=".json"
                    onChange={handleFileChange}
                />
            </div>

            <div className="d-grid gap-2">
                <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={!file}
                >
                    <FontAwesomeIcon icon={faUpload} />
                    <span className="ms-2">
                        Prześlij plik
                    </span>
                </button>
            </div>

            {message && (
                <div className="alert alert-success mt-3" role="alert">
                    {message}
                </div>
            )}

            {error && (
                <div className="alert alert-danger mt-3" role="alert">
                    {error}
                </div>
            )}
        </div>
    );
};

export default InitDB;
