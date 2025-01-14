import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useItinerary } from "../Itinerary";

export default function SelectMap({ markers, setLocation, clusterGroupRef }) {
  const { itinerary } = useItinerary();
  const activities = itinerary.activities;
  const prevCoods = activities[activities.length - 1];
  const center =
    activities.length > 0
      ? [prevCoods.locationLat, prevCoods.locationLon]
      : [40.6501681934524, -73.9996029760112];

  const FitSearchBounds = () => {
    const map = useMap();

    const coordinates = markers.map((activity) => {
      return activity.position;
    });

    useEffect(() => {
      if (coordinates.length) {
        map.fitBounds(coordinates, { padding: [20, 20] });
      }
    }, [map, coordinates]);

    return null;
  };

  return (
    <MapContainer
      className="h-screen w-full absolute max-sm:top-0 max-sm:translate-y-0 top-1/2 translate-y-[-50%]"
      center={center}
      zoom={7}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitSearchBounds />
      <ZoomControl position="bottomright" />
      <MarkerClusterGroup ref={clusterGroupRef}>
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position} id={marker.id}>
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
      </MarkerClusterGroup>
    </MapContainer>
  );
}
