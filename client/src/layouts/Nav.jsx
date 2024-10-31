import { useAuth } from "../context/AuthContext";
import { usePage } from "../App";
import Itineraries from "../pages/Itineraries";

export default function Nav() {
  const { user, logout } = useAuth();
  const { setPage } = usePage();

  return (
    <div className="bg-[#4ABDAC] text-white">
      <nav className="max-w-6xl mx-auto h-14 flex justify-between">
        {user ? (
          <>
            <button
              className="nav-button"
              onClick={() => setPage(<Itineraries />)}
            >
              <i className="fa-solid fa-map mr-1"></i> Itineraries
            </button>
            <div className="flex">
              <button className="nav-button px-4" onClick={() => setPage("")}>
              <i className="fa-solid fa-user"></i>
              </button>
              <button className="nav-button px-4" onClick={logout}>
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          </>
        ) : (
          <p className="text-lg mx-auto flex items-center"><i className="fa-solid fa-map mr-1"></i> Itinerary App</p>
        )}
      </nav>
    </div>
  );
}
