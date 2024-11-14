import { useState } from "react";
import { clickMarker } from "../../functions/mapFunctions";

export default function LocationSearch({
  markerRefs,
  setMarkers,
  setMapCenter,
  mapCenter,
  clusterGroupRef,
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
      const firstResult = results[0];

      const newMarkers = results.map((place) => ({
        id: place.place_id,
        name: place.display_name,
        position: [parseFloat(place.lat), parseFloat(place.lon)],
      }));

      setMarkers(newMarkers);
      setMapCenter([parseFloat(firstResult.lat), parseFloat(firstResult.lon)]);
    } else {
      setMapCenter(mapCenter);
      setMarkers([]);
    }
  };

  return (
    <>
      <form className="absolute top-20 left-[10px] z-[1000]">
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
      {results.length > 0 && (
        <div className="absolute border bg-white w-[273px] top-32 left-[10px] z-[1000]">
          <p
            className="p-1 bg-gray-100 font-semibold cursor-pointer select-none"
            onClick={() => setToggleLocations((prev) => !prev)}
          >
            Locations
          </p>
          {toggleLocations && (
            <div className="overflow-x-hidden flex flex-col bg-white max-h-96">
              {results.map((location, idx) => {
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
                    onClick={() =>
                      clickMarker(clusterGroupRef, location.place_id)
                    }
                  >
                    {name}, <b>{location.address.country}</b>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}
