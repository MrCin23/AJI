import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import axios from '../../api/Axios.ts';
import { useUser } from '../../contexts/UserContext';
import { AxiosError } from 'axios';

interface Credentials {
    login: string;
    password: string;
}

const Login: React.FC = () => {
    const [credentials, setCredentials] = useState<Credentials>({ login: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const { user, login } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post<string>('/users/login', credentials);

            Cookies.set('jwt', response.data, { expires: 1 / 24, secure: true });
            Cookies.set('refreshToken', response.data, { expires: 7, secure: true });

            const userResponse = await axios.get('/users/auth/me');
            const user = userResponse.data;
            login(user);

            navigate("/");
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response && error.response.data && error.response.data.detail) {
                    if (error.response.data.detail === 'The username or password is incorrect.') {
                        setError('Nazwa użytkownika lub/i hasło są niepoprawne');
                    } else {
                        setError(error.response.data.detail);
                    }
                } else {
                    setError('Logowanie nie powiodło się. Spróbuj ponownie później');
                }
            } else {
                throw new Error("unknown error");
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-light">
            <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <form onSubmit={handleLogin}>
                    <h3 className="text-center mb-4">Logowanie</h3>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="login" className="form-label">Nazwa użytkownika</label>
                        <input
                            type="text"
                            id="login"
                            className="form-control"
                            placeholder="Wprowadź nazwę użytkownika"
                            value={credentials.login}
                            onChange={(e) => setCredentials({ ...credentials, login: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Hasło</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Wprowadź hasło"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Zaloguj się</button>
                </form>
            </div>
        </div>
    );
};

export default Login;