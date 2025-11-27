import { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

interface User {
  sub: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Decode token to get user info (simplified for now, assuming backend sends user info or we decode JWT)
      // For this prompt, we'll just assume the token is valid and set a dummy user or decode if possible.
      // Let's decode the JWT payload.
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        setUser({ sub: payload.sub, role: payload.role });
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (e) {
        console.error("Invalid token", e);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

    try {
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      setUser({ sub: payload.sub, role: payload.role });
    } catch (e) {
      console.error("Error decoding token on login", e);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
