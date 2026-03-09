import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = (email, _password, role) => {
        setUser({ name: email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, c => c.toUpperCase()), email, role });
        return true;
    };

    const signup = (name, email, _password, role) => {
        setUser({ name, email, role });
        return true;
    };

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
