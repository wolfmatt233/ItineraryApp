import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authRequests } from "../../requests/authRequests";
import { usePage } from "../../App";

export default function User() {
  const { user, logout } = useAuth();
  const { setError } = usePage();
  const { changePassword, deleteAccount } = authRequests();
  const [action, setAction] = useState();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (action === "password") {
      // send current info & new password
      const res = await changePassword(formData);
      const { response, data } = res;

      if (response.ok) {
        setAction(null);
        setError({ status: 200, message: data.message });
      } else {
        setError({ status: response.status, message: data.error });
      }
    } else if (action === "delete") {
      // send current info to confirm & delete
      const res = await deleteAccount(formData);
      const { response, data } = res;

      if (response.ok) {
        setAction(null);
        logout();
        setError({ status: 200, message: data.message });
      } else {
        setError({ status: response.status, message: data.error });
      }
    }
  };

  return (
    <div className="page-layout flex flex-col">
      <title>Your Account</title>
      <p className="page-title">Your Account: {user.username}</p>

      <button
        className="basic-button p-2 mb-3 max-sm:rounded-none"
        onClick={() => setAction("password")}
      >
        <i className="fa-solid fa-user-pen mr-2"></i>
        Change Password
      </button>
      <button
        className="basic-button-red p-2 site-red hover:bg-[#fc1a1a] max-sm:rounded-none"
        onClick={() => setAction("delete")}
      >
        <i className="fa-solid fa-user-xmark mr-2"></i>
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
                  <label htmlFor="password">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
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
                {action == "password" ? "Update Password" : "Delete Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
