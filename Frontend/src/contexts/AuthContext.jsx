import { createContext, useContext, useState, useEffect } from "react";
import { staffApi, setToken } from "@/lib/api";

const AUTH_KEY = "staffUser";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem(AUTH_KEY);
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await staffApi.login(email, password);
    setToken(data.token);
    const userInfo = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: (data.role || "").toLowerCase() === "admin" ? "admin" : "manager",
      permissions: data.permissions || {},
    };
    setUser(userInfo);
    localStorage.setItem(AUTH_KEY, JSON.stringify(userInfo));
    return userInfo;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
