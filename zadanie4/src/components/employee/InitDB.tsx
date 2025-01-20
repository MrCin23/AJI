import React, { useState, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import axios from '../../api/Axios';

interface Product {
    name: string;
    description: string;
    price: number;
    weight: number;
    category: string | { $oid: string };
}

const InitDB: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');

    const validateJsonStructure = (jsonData: Product[]): string | null => {
        if (!Array.isArray(jsonData)) {
            return 'Błąd: Plik JSON musi zawierać tablicę produktów.';
        }

        for (let i = 0; i < jsonData.length; i++) {
            const product = jsonData[i];

            if (!product.name) {
                return `Błąd: Produkt ${i + 1} - Brak lub nieprawidłowa nazwa.`;
            }
            if (!product.description) {
                return `Błąd: Produkt ${i + 1} - Brak lub nieprawidłowy opis.`;
            }
            if (typeof product.price !== 'number' || product.price <= 0) {
                return `Błąd: Produkt ${i + 1} - Brak lub nieprawidłowa cena.`;
            }
            if (typeof product.weight !== 'number' || product.weight <= 0) {
                return `Błąd: Produkt ${i + 1} - Brak lub nieprawidłowa waga.`;
            }

            const category = product.category;
            if (!category || (typeof category !== 'string' && typeof category !== 'object')) {
                return `Błąd: Produkt ${i + 1} - Brak lub nieprawidłowy identyfikator kategorii.`;
            }

            if (typeof category === 'object' && category.hasOwnProperty('$oid')) {
                if (typeof category.$oid !== 'string') {
                    return `Błąd: Produkt ${i + 1} - Nieprawidłowy format identyfikatora kategorii.`;
                }
            } else if (typeof category === 'string') {
                if (category.trim().length === 0) {
                    return `Błąd: Produkt ${i + 1} - Kategoria nie może być pustym ciągiem znaków.`;
                }
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
                    const jsonData: Product[] = JSON.parse(e.target.result as string);
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
                    setError('Błąd: Plik JSON jest nieprawidłowy.');
                    setFile(null);
                }
            };
            reader.readAsText(selectedFile);
        } else {
            setError('Błąd: Można przesyłać tylko pliki JSON.');
            setFile(null);
        }
    };

    const handleSubmit = async () => {
        setError('');
        setMessage('');

        if (!file) {
            setError('Proszę wybrać plik JSON do przesłania.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('/init', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage("Inicjalizacja produktów przebiegła pomyślnie.");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.detail) {
                if (error.response.data.detail === 'Database already initialized with products.') {
                    setError('Baza danych zawiera już produkty.');
                } else {
                    setError(error.response.data.detail);
                }
            } else {
                setError('Błąd podczas inicjalizacji bazy danych.');
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
