import { useState } from "react";
import { clickMarker } from "../../functions/mapFunctions";

export default function LocationSearch({
  setMarkers,
  clusterGroupRef,
  setLocation,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [toggleLocations, setToggleLocations] = useState(true);

  const search = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`
      );
      const data = await response.json();
      setResults(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const results = await search();

    if (results && results.length > 0) {
      const newMarkers = results.map((place) => ({
        id: place.place_id,
        name: place.display_name,
        position: [parseFloat(place.lat), parseFloat(place.lon)],
      }));

      setMarkers(newMarkers);
    } else {
      setMarkers([]);
    }
  };

  return (
    <>
      <form className="absolute left-3 top-[10px] z-[1000]">
        <input
          type="text"
          className="basic-input p-2 w-60 rounded-s-md"
          placeholder="Search"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        <button
          type="submit"
          className="bg-white border border-l-0 border-gray-300 p-2  rounded-e-md"
          onClick={handleSearch}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>
      <div className="w-[273px] absolute bg-white max-h-40 left-3 top-16 z-[1000] rounded-t-md">
        <p
          className={`${
            toggleLocations ? "rounded-t-md" : "rounded-sm"
          } list-title`}
          onClick={() => setToggleLocations((prev) => !prev)}
        >
          Locations
          <i
            className={`fa-solid fa-caret-${
              toggleLocations ? "up mt-1" : "down"
            } ml-2 mr-1`}
          ></i>
        </p>
        {toggleLocations && (
          <>
            <div className="overflow-x-hidden flex flex-col bg-white max-h-96">
              {results.length > 0 ? (
                results.map((location, idx) => {
                  let addressNames = location.display_name.split(",");
                  let name = "";

                  addressNames.forEach((item, idx) => {
                    if (item != addressNames[addressNames.length - 1]) {
                      name += item;
                    }
                  });
                  return (
                    <button
                      key={idx}
                      className="hover:bg-gray-200 border-b p-1 text-left"
                      onClick={() => {
                        clickMarker(clusterGroupRef, location.place_id);
                      }}
                    >
                      {name}, <b>{location.address.country}</b>
                    </button>
                  );
                })
              ) : (
                <div className="hover:bg-gray-200 border-b p-1 text-left">
                  No results, search for a location!
                </div>
              )}
            </div>
            <button
              className="site-green text-white p-2 text-left w-full flex items-center justify-between hover:site-yellow rounded-b-md"
              onClick={() => {
                setLocation("none");
              }}
            >
              Continue without a location
              <i className="fa-solid fa-right-long"></i>
            </button>
          </>
        )}
      </div>
    </>
  );
}
