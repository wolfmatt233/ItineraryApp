import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import Nav from "./layouts/Nav";
import Footer from "./layouts/Footer";
import User from "./pages/user/User";
import Login from "./pages/user/Login";
import SignUp from "./pages/user/SignUp";
import Itineraries from "./pages/itinerary/Itineraries";
import CreateItinerary from "./pages/itinerary/CreateItinerary";
import Itinerary from "./pages/itinerary/Itinerary";
import LoadingModal from "./layouts/LoadingModal";
import Error from "./pages/Error";
import Loading from "./layouts/Loading";

const PageContext = createContext();
export const usePage = () => useContext(PageContext);

export default function App() {
  const { user, loading } = useAuth();
  const [pageLoading, setPageLoading] = useState(false);
  const [page, setPage] = useState("");

  useEffect(() => {
    if (user) {
      setPage("itineraries");
    } else {
      setPage("login");
    }
  }, [user]);

  if (loading) return <Loading />;

  return (
    <PageContext.Provider value={{ page, setPage, setPageLoading }}>
      {pageLoading && <LoadingModal />}

      <Nav />

      {page === "itineraries" ? (
        <Itineraries />
      ) : page === "login" ? (
        <Login />
      ) : page === "signup" ? (
        <SignUp />
      ) : page === "user" ? (
        <User />
      ) : page === "create-itinerary" ? (
        <CreateItinerary />
      ) : page.split(":")[0] === "itinerary" ? (
        <Itinerary id={page.split(":")[1]} />
      ) : page.split(":")[0] === "error" ? (
        <Error error={page.split(":")[1]} />
      ) : null}
      
      <Footer />
    </PageContext.Provider>
  );
}
