import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import Login from "./features/auth/pages/Login";
import Itineraries from "./features/itineraries/pages/Itineraries";
import Nav from "./layouts/Nav";
import Footer from "./layouts/Footer";

const PageContext = createContext();

export const usePage = () => useContext(PageContext);

export default function App() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState("");

  useEffect(() => {
    if (user) {
      setPage(<Itineraries />);
    } else {
      setPage(<Login />);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <i className="fas fa-circle-notch fa-spin text-5xl text-black"></i>
      </div>
    );
  }

  return (
    <PageContext.Provider value={{ page, setPage }}>
      <Nav />
      {page}
      <Footer />
    </PageContext.Provider>
  );
}
