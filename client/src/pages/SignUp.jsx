import { useEffect, useState } from "react";

export default function SignUp() {
  const { user, login, logout } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const signUp = async () => {};

  return (
    <form className="login-modal">
      <p>Sign Up</p>
      <label htmlFor="name">Username</label>
      <input
        type="text"
        name="username"
        className="basic-input"
        onChange={handleChange}
      />
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
      <button
        type="submit"
        className="basic-button basic-input"
        onSubmit={signUp}
      >
        Sign Up
      </button>
    </form>
  );
}
