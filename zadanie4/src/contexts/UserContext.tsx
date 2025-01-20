import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import axios from '../api/Axios';

interface User {
    id: number;
    login: string;
    role: "CLIENT" | "EMPLOYEE";
}

interface UserContextType {
    user: User | null;
    login: (userInfo: User) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const fetchUserData = async () => {
        const token = Cookies.get('jwt');
        if (token) {
            try {
                const response = await axios.get<User>('/users/auth/me', {
                    headers: { authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                logout();
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const login = (userInfo: User) => setUser(userInfo);

    const logout = () => {
        setUser(null);
        Cookies.remove('jwt');
        Cookies.remove('refreshToken');
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
