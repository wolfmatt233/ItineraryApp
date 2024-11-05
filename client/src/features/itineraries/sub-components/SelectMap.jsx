import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { getLastActivity } from "../functions/getFirstActivity";

export default function SelectMap({ setLocation, itinerary, setShowMap }) {
  const [query, setQuery] = useState("");
  const [markers, setMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState(
    getLastActivity(itinerary.activities)
  );

  const search = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`
      );
      const data = response.json();
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
        name: place.display_name,
        position: [parseFloat(place.lat), parseFloat(place.lon)],
      }));

      setMarkers(newMarkers);
      setMapCenter([parseFloat(firstResult.lat), parseFloat(firstResult.lon)]);
    } else {
      setMapCenter([0, 0]);
      setMarkers([]);
    }
  };

  const MapUpdater = () => {
    const map = useMap();

    useEffect(() => {
      if (markers.length > 0) {
        if (markers.length === 1) {
          map.setView(markers[0].position, 4); // You can adjust the zoom level (13) as needed
        } else {
          const bounds = markers.map((marker) => marker.position);
          map.fitBounds(bounds);
        }
      } else {
        map.setView(mapCenter);
      }
    }, [map, markers, mapCenter]);
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 h-screen">
      <div className="h-3/4 max-sm:h-screen">
        <form className="absolute top-5 z-[1000] left-1/2 translate-x-[-50%]">
          <input
            type="text"
            className="basic-input p-2 w-60"
            placeholder="Search"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <button
            type="submit"
            className="bg-white border border-l-0 border-gray-300 p-2"
            onClick={handleSearch}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </form>
        <button className="max-sm:top-[83px] absolute top-6 left-[13px] icon-button bg-white border border-gray-300 hover:bg-red-500 z-[1000]" onClick={() => setShowMap(true)}><i class="fa-solid fa-x"></i></button>

        <MapContainer
          className="h-3/4 max-sm:h-screen w-full absolute max-sm:top-0 max-sm:translate-y-0 top-1/2 translate-y-[-50%]"
          center={mapCenter}
          zoom={3}
          scrollWheelZoom={true}
        >
          <MapUpdater />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          />
          {markers.map((marker, idx) => (
            <Marker key={idx} position={marker.position}>
              <Popup>
                <p>{marker.name}</p>
                <p>
                  Coordinates: {marker.position[0]}, {marker.position[1]}
                </p>
                <button
                  className="link-button"
                  onClick={() => setLocation(marker)}
                >
                  Select Location
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
