import { useAuth } from "../context/AuthContext";
import { usePage } from "../App";
import { useState } from "react";

export default function Nav() {
  const { user, logout } = useAuth();
  const { setPage } = usePage();
  const [toggleDropdown, setToggleDropdown] = useState(false);

  return (
    <div className="site-green text-white relative">
      {toggleDropdown && (
        <div className="absolute top-0 left-0 w-[70vw] h-screen bg-gray-100 z-[10000] border-r">
          <i
            class="fa-solid fa-xmark site-green h-14 flex items-center justify-center site-green hover:site-yellow cursor-pointer border-b"
            onClick={() => setToggleDropdown((prev) => !prev)}
          ></i>
          <button className="site-green h-14 w-full flex items-center justify-center site-green hover:site-yellow cursor-pointer border-b">
            <i className="fa-solid fa-map mr-1"></i> Itineraries
          </button>
          <button className=" site-green h-14 w-full flex items-center justify-center site-green hover:site-yellow cursor-pointer border-b">
            <i className="fa-solid fa-plus mr-1"></i> Create Itinerary
          </button>
        </div>
      )}

      <nav className="max-w-6xl mx-auto h-14 flex justify-between px-4 max-sm:px-0">
        {user ? (
          <>
            <button
              className="text-lg hover:site-yellow px-4 hidden max-sm:block"
              onClick={() => setToggleDropdown((prev) => !prev)}
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <div className="h-full flex max-sm:hidden">
              <button
                className="text-lg hover:site-yellow px-2"
                onClick={() => setPage("itineraries")}
              >
                <i className="fa-solid fa-map mr-1"></i> Itineraries
              </button>
              <button
                className="text-lg hover:site-yellow px-2"
                onClick={() => setPage("create-itinerary")}
              >
                <i className="fa-solid fa-plus mr-1"></i> Create Itinerary
              </button>
            </div>
            <div className="flex">
              <button
                className="text-lg hover:site-yellow px-4"
                onClick={() => setPage("user")}
              >
                <i className="fa-solid fa-user"></i>
              </button>
              <button
                className="text-lg hover:site-yellow px-4"
                onClick={logout}
              >
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
