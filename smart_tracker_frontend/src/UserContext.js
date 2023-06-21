import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSetUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, setUser: handleSetUser, logout: handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;