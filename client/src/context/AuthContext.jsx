import { createContext, useState, useContext, useEffect } from "react";
import { authRequests } from "../requests/authRequests";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initLoad, setInitLoad] = useState(true);
  const { fetchUser, tokenRefresh, fetchLogin } = authRequests();

  const getUser = async () => {
    const res = await fetchUser();
    const { response, data } = res;

    if (response.ok) {
      setInitLoad(false);
      setUser(data);
    } else if (response.status === 403) {
      // try to refresh expired token with a new one
      refreshLogin();
    }
  };

  const refreshLogin = async () => {
    const res = await tokenRefresh();
    const { response, data } = res;

    if (data.accessToken) {
      // On successfull refresh, set new access token
      localStorage.setItem("accessToken", data.accessToken);

      // Prevent component reload on token refresh, only on init
      if (initLoad) {
        getUser();
      }
    } else {
      // Invalid or empty refresh token, logout
      logout();
    }

    setLoading(false);
  };

  const login = async (formData) => {
    const res = await fetchLogin(formData);
    const { response, data } = res;

    if (data.accessToken && data.refreshToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      getUser();
    } else {
      alert("Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  useEffect(() => {
    getUser();
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
