import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const userResponse = await fetch(
          "http://localhost:5000/api/auth/user",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const userData = await userResponse.json();
        console.log(userData);
        setUser(userData);
      } catch (error) {
        alert("Error logging in");
      }
    };

    checkLogin();
  }, []);

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

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
