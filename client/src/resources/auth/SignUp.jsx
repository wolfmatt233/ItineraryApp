import { useState } from "react";
import { usePage } from "../../App";
import { useAuth } from "../../context/AuthContext";
import { authRequests } from "../../requests/authRequests";

export default function SignUp() {
  const { login } = useAuth();
  const { fetchSignup } = authRequests();
  const { setPage, setError } = usePage();
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

    const { response, data } = await fetchSignup(formData);

    if (response.ok) {
      await login(formData);
    } else {
      setError({ status: response.status, message: data.error });
    }
  };

  return (
    <div className="page-layout">
      <title>Sign Up</title>
      <form className="w-[350px] bg-white modal">
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
        <button type="submit" className="basic-button" onClick={signUp}>
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
