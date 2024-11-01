import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkLogin = async () => {
    try {
      const userResponse = await fetch("http://localhost:5000/api/auth/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const userData = await userResponse.json();

      if (userData.message) {
        // if the user cannot be retrieved due to outdated access token
        // try to refresh it with the refresh token
        refreshLogin();
      } else {
        setUser(userData);
        setLoading(false);
      }
    } catch (error) {
      alert("Error logging in");
    }
  };

  const refreshLogin = async () => {
    try {
      // Refresh the access token using the refresh token
      const refreshResponse = await fetch(
        "http://localhost:5000/api/auth/refresh-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refreshToken: localStorage.getItem("refreshToken"),
          }),
        }
      );

      const data = await refreshResponse.json();

      if (data.accessToken) {
        // Recheck the user
        localStorage.setItem("accessToken", data.accessToken);
        checkLogin();
      } else {
        // Invalid or empty refresh token error
        setUser(null);
        setLoading(false);
        console.log(data.message);
      }
    } catch (error) {
      alert("Error refreshing your login");
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (formData) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.accessToken && data.refreshToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        const userResponse = await fetch(
          "http://localhost:5000/api/auth/user",
          {
            headers: {
              Authorization: `Bearer ${data.accessToken}`,
            },
          }
        );

        const userData = await userResponse.json();
        setUser(userData);
      } else {
        alert("Login Failed");
      }
    } catch (error) {
      alert(error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
