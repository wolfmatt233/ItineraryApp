import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import Nav from "./layouts/Nav";
import Footer from "./layouts/Footer";
import LoadingModal from "./layouts/LoadingModal";
import Loading from "./layouts/Loading";
import RenderPage from "./RenderPage";
import Alert from "./layouts/Alert";

const PageContext = createContext();
export const usePage = () => useContext(PageContext);

export default function App() {
  const { user, loading } = useAuth();
  const [pageLoading, setPageLoading] = useState(false);
  const [page, setPage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (user) {
      setPage("itineraries");
    } else {
      setPage("login");
    }
  }, [user]);

  if (loading) return <Loading />;

  return (
    <PageContext.Provider
      value={{ page, setPage, setPageLoading, error, setError }}
    >
      {pageLoading && <LoadingModal />}

      <Nav />

      {error && <Alert {...error} />}

      <RenderPage user={user} page={page} />

      <Footer />
    </PageContext.Provider>
  );
}
