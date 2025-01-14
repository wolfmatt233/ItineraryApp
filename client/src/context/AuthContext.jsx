import { createContext, useState, useContext, useEffect } from "react";
import { authRequests } from "../requests/authRequests";
import { usePage } from "../App";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initLoad, setInitLoad] = useState(true);
  const { fetchUser, tokenRefresh, fetchLogin } = authRequests();

  const getUser = async () => {
    const { response, data } = await fetchUser();

    if (response.ok) {
      setInitLoad(false);
      setUser(data);
      setLoading(false);
    } else if (response.status === 403) {
      // try to refresh expired token with a new one
      refreshLogin();
    } else {
      logout();
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

    if (response.ok && data.accessToken && data.refreshToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      await getUser();
    } else {
      return res;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setLoading(false);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      getUser();
    } else {
      logout();
    }
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
