import { useAuth } from "../context/AuthContext";
import { usePage } from "../App";
import Itineraries from "../features/itineraries/pages/Itineraries";
import CreateItinerary from "../features/itineraries/pages/CreateItinerary";
import User from "../features/auth/pages/User";

export default function Nav() {
  const { user, logout } = useAuth();
  const { setPage } = usePage();

  return (
    <div className="bg-[#4ABDAC] text-white">
      <nav className="max-w-6xl mx-auto h-14 flex justify-between px-4 max-sm:-mx-4 max-sm:px-2">
        {user ? (
          <>
            <div className="h-full flex">
              <button
                className="nav-button"
                onClick={() => setPage(<Itineraries />)}
              >
                <i className="fa-solid fa-map mr-1"></i> Itineraries
              </button>
              <button
                className="nav-button"
                onClick={() => setPage(<CreateItinerary />)}
              >
                <i className="fa-solid fa-plus mr-1"></i> Create Itinerary
              </button>
            </div>
            <div className="flex">
              <button
                className="nav-button px-4"
                onClick={() => setPage(<User />)}
              >
                <i className="fa-solid fa-user"></i>
              </button>
              <button className="nav-button px-4" onClick={logout}>
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          </>
        ) : (
          <p className="text-lg mx-auto flex items-center select-none">
            <i className="fa-solid fa-map mr-1"></i> Itinerary App
          </p>
        )}
      </nav>
    </div>
  );
}
