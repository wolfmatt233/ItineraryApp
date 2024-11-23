import { useState } from "react";
import { usePage } from "../../App";
import { useAuth } from "../../context/AuthContext";

export default function SignUp() {
  const { login } = useAuth();
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

  const signUp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 201) {
        login(formData);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Registration failed");
    }
  };

  return (
    <div className="page-layout">
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
          onClick={signUp}
        >
          Sign Up
        </button>

        <button
          className="link-button w-fit mx-auto"
          onClick={() => setPage("login")}
        >
          Already have an account? Log in here!
        </button>
      </form>
    </div>
  );
}
