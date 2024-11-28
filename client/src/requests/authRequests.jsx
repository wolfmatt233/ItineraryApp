export const authRequests = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchUser = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${apiUrl}/auth/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      return { response, data };
    } catch (error) {
      console.log("Request failed: ", error);
    }
  };

  const tokenRefresh = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      // Refresh the access token using the refresh token
      const response = await fetch(`${apiUrl}/auth/refresh-token`, {
        method: "POST",
        headers: {
          Authorization: JSON.stringify({
            refreshToken: refreshToken,
          }),
        },
      });

      const data = await response.json();

      return { response, data };
    } catch (error) {
      console.log("Request failed: ", error);
    }
  };

  const fetchLogin = async (formData) => {
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      return { response, data };
    } catch (error) {
      console.log("Request failed: ", error);
    }
  };

  return { fetchUser, tokenRefresh, fetchLogin };
};
