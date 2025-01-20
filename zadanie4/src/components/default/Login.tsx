import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import axios from '../../api/Axios';
import { useUser } from '../../contexts/UserContext';

interface Credentials {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const [credentials, setCredentials] = useState<Credentials>({ username: '', password: '' });
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
            const response = await axios.post<{ token: string; refreshToken: string }>('/login', credentials);
            const { token, refreshToken } = response.data;

            Cookies.set('jwt', token, { expires: 1 / 24, secure: true });
            Cookies.set('refreshToken', refreshToken, { expires: 7, secure: true });

            const userResponse = await axios.get('/auth/me');
            const user = userResponse.data;
            login(user);

            navigate("/");
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.detail) {
                if (error.response.data.detail === 'The username or password is incorrect.') {
                    setError('Nazwa użytkownika lub/i hasło są niepoprawne');
                } else {
                    setError(error.response.data.detail);
                }
            } else {
                setError('Logowanie nie powiodło się. Spróbuj ponownie później');
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <form onSubmit={handleLogin} className="p-4 border rounded shadow-sm">
                        <h3 className="text-center mb-4">Logowanie</h3>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nazwa użytkownika"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Hasło"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Zaloguj się</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
