import { createContext, useContext, useEffect, useState } from 'react';
import axiosClient, { setAuthToken } from '../api/axiosClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     // dane użytkownika
  const [token, setToken] = useState(null);   // JWT
  const [loading, setLoading] = useState(true);

  // wczytanie stanu z localStorage przy starcie aplikacji
  useEffect(() => {
    const saved = localStorage.getItem('auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.token && parsed.user) {
          setToken(parsed.token);
          setUser(parsed.user);
          setAuthToken(parsed.token);
        }
      } catch {
        // ignorowanie
        localStorage.removeItem('auth');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axiosClient.post('/auth/login', { email, password });
      const { token: jwt, user: userData } = res.data;

      setToken(jwt);
      setUser(userData);
      setAuthToken(jwt);
      localStorage.setItem('auth', JSON.stringify({ token: jwt, user: userData }));

      return { success: true, user: userData };
    } catch (err) {
      console.error('Login error:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Nie udało się zalogować. Spróbuj ponownie.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (data) => {
    try {
      setLoading(true);
      const res = await axiosClient.post('/auth/register', data);
      // backend zwraca samego usera, bez tokena
      return { success: true, user: res.data.user };
    } catch (err) {
      console.error('Register error:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Nie udało się utworzyć konta.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem('auth');
  };

  const value = {
    user,
    token,
    loading,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    registerUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
