import { useEffect, useState } from "react";
import { usePage } from "../App";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";

export default function SignUp() {
  const { user, login } = useAuth();
  const { setPage } = usePage();
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

  const signUp = async () => {
    const signUp = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await signUp.json();
    alert(data.message);

    if (signUp.response === 201) {
      login(formData);
    } else {
      alert(data.message);
    }
  };

  return (
    <form className="login-modal">
      <p className="text-center text-lg">Sign Up</p>
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

      <button className="link-button" onClick={() => setPage(<Login />)}>
        Already have an account? Log in here!
      </button>
    </form>
  );
}
