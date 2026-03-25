
import { createContext, useEffect } from "react";
import { AuthResponse } from "../types";
import React from "react";


interface AuthContextType {
    user: AuthResponse | null;
    token: string | null;
    login: (data: AuthResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
}


const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: () => {},
    logout: () => {},
    isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = React.useState<AuthResponse | null>(null);
    const [token, setToken] = React.useState<string | null>(null);
    
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (data: AuthResponse) => {
        setUser(data);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
    };
    
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

 export const useAuth = () => React.useContext(AuthContext);

