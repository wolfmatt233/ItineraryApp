import { useAuth } from "../../context/AuthContext";

export default function User() {
  const { user } = useAuth();
  return (
    <div className="page-layout">
      <p className="text-lg py-2 border-b mb-5">Welcome, {user.username}!</p>
    </div>
  );
}
