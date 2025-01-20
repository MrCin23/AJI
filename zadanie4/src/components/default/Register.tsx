import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import axios from '../../api/Axios';

const Register: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        try {
            await axios.post('/register', { username, password });
            setSuccessMessage('Twoje konto zostało założone. Teraz możesz się na nie zalogować.');
            // navigate("/"); // Można odkomentować, jeśli po rejestracji użytkownik ma być przenoszony na inną stronę
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.detail) {
                if (error.response.data.detail === 'A user with this username already exists.') {
                    setError('Użytkownik o takiej nazwie użytkownia już istnieje.');
                } else {
                    setError(error.response.data.detail);
                }
            } else {
                setError('Rejestracja nie powiodła się. Spróbuj ponownie później');
            }
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <form onSubmit={handleRegister} className="p-4 border rounded shadow-sm">
                        <h3 className="text-center mb-4">Rejestracja</h3>
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="mb-3">
                            <input
                                type="text"
                                className={`form-control ${error ? 'is-invalid' : ''}`}
                                placeholder="Nazwa użytkownika"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3 position-relative">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                className="form-control"
                                placeholder="Hasło"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                                onClick={togglePasswordVisibility}
                            >
                                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                            </button>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Zarejestruj się</button>
                    </form>

                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            {successMessage}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
