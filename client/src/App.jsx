import { useEffect, useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Itineraries from "./pages/Itineraries";
import Nav from "./layouts/Nav";

export default function App() {
  const { user } = useAuth();
  const [page, setPage] = useState("");

  useEffect(() => {
    if (user != null) {
      setPage(<Itineraries />);
    } else {
      setPage(<Login />);
    }
  }, [user]);

  return (
    <>
      <Nav />
      {page}
    </>
  );
}
