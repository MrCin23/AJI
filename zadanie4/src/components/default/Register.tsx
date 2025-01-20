import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import axios from '../../api/Axios';
import {AxiosError} from "axios";

const Register: React.FC = () => {
    const [login, setLogin] = useState<string>('');
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
            await axios.post('/users/register', { login, password, role:"CLIENT" });
            setSuccessMessage('Twoje konto zostało założone. Teraz możesz się na nie zalogować.');
            navigate("/login");
        } catch (error) {
            if(error instanceof AxiosError){
                if (error.response && error.response.data && error.response.data.detail) {
                    if (error.response.data.detail === 'A user with this username already exists.') {
                        setError('This username is already taken');
                    } else {
                        setError(error.response.data.detail);
                    }
                } else {
                    setError('Registration failed. Try again.');
                }
            } else {
                throw new Error("unknown error")
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
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
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
