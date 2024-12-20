import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function User() {
  const { user } = useAuth();
  const [action, setAction] = useState();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newPassword: "",
  });

  const handleChange = () => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (action === "password") {
      // send current info & new password
      changePassword(formData);
    } else if (action === "delete") {
      // send current info to confirm & delete
    }
  };

  return (
    <div className="page-layout flex flex-col">
      <p className="text-lg py-2 border-b mb-5">
        Your Account: {user.username}
      </p>

      <button
        className="basic-button p-2 mb-3"
        onClick={() => setAction("password")}
      >
        <i class="fa-solid fa-user-pen mr-2"></i>
        Change Password
      </button>
      <button
        className="basic-button-red p-2 site-red hover:bg-[#fc1a1a]"
        onClick={() => setAction("delete")}
      >
        <i class="fa-solid fa-user-xmark mr-2"></i>
        Delete Account
      </button>

      {action && (
        <div
          onClick={(e) => {
            if (e.target.id === "modal-background") {
              setAction(null);
            }
          }}
          id="modal-background"
          className="fixed inset-0 bg-black bg-opacity-50 z-[5000]"
        >
          <div className="modal w-full max-w-[350px] bg-white">
            <form className="flex flex-col">
              <p className="text-center text-lg">Confirm Credentials</p>
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
              {action === "password" && (
                <>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="basic-input"
                    onChange={handleChange}
                  />
                </>
              )}
              <button
                type="submit"
                className="basic-button"
                onClick={handleSubmit}
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
