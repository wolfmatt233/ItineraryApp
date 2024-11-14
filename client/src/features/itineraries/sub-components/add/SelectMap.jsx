import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { getLastActivity } from "../../functions/getFirstActivity";
import LocationSearch from "./LocationSearch";
import { useItinerary } from "../../pages/Itinerary";
import MarkerClusterGroup from "react-leaflet-markercluster";

export default function SelectMap({ setLocation }) {
  const { itinerary, setShowMap } = useItinerary();
  const [markers, setMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState(
    getLastActivity(itinerary.activities)
  );
  const markerRefs = useRef([]);
  const clusterGroupRef = useRef();

  const markerMap = markers.map((marker, idx) => (
    <Marker
      key={idx}
      position={marker.position}
      ref={(el) => (markerRefs.current[idx] = el)}
      id={marker.id}
    >
      <Popup>
        <p>{marker.name}</p>
        <p>
          Coordinates: {marker.position[0]}, {marker.position[1]}
        </p>
        <button className="link-button" onClick={() => setLocation(marker)}>
          Select Location
        </button>
      </Popup>
    </Marker>
  ));

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
      <div className="h-screen">
        <i
          className="fa-solid fa-circle-xmark absolute z-[1000] right-3 top-3 basic-button m-0 bg-red-400 text-white hover:bg-red-500 h-9 w-9 flex items-center justify-center max-sm:right-6 cursor-pointer"
          onClick={() => setShowMap((prev) => !prev)}
        ></i>
        <LocationSearch
          markerRefs={markerRefs}
          setMarkers={setMarkers}
          setMapCenter={setMapCenter}
          mapCenter={mapCenter}
          clusterGroupRef={clusterGroupRef}
        />
        <MapContainer
          className="h-screen w-full absolute max-sm:top-0 max-sm:translate-y-0 top-1/2 translate-y-[-50%]"
          center={mapCenter}
          zoom={3}
          scrollWheelZoom={true}
        >
          <MapUpdater />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          />
          <MarkerClusterGroup ref={clusterGroupRef}>
            {markerMap}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
}
