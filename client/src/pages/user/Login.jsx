import { useState } from "react";
import { usePage } from "../../App";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const { setPage } = usePage();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const loginApi = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="page-layout">
      <form className="basic-input login-modal">
        <p className="text-center text-lg">Login</p>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          className="basic-input"
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          className="basic-input"
          onChange={handleChange}
        />
        <button type="submit" className="basic-button" onClick={loginApi}>
          Log In
        </button>

        <button
          className="link-button w-fit mx-auto"
          onClick={() => setPage("signup")}
        >
          No account? Sign up here!
        </button>
      </form>
    </div>
  );
}
