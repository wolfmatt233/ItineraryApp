import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";
import { convertDate, getTime } from "../../functions/formatDate";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useActivity } from "./ActivityMap";
import { useEffect } from "react";
import { getFirstActivity } from "../../functions/mapFunctions";
import { useItinerary } from "../../pages/Itinerary";

export default function ActivityMarkers({ activities, setActivityId }) {
  const { applyFilter, scroll, setModal, clusterGroupRef } = useActivity();
  const { setShowMap } = useItinerary();
  const filteredActivities = applyFilter();
  const firstCoords = getFirstActivity(filteredActivities);
  const lineMap = activities
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    .map((activities) => {
      const coords = activities.location.coordinates;
      return [coords.lat, coords.lon];
    });

  const MapUpdater = () => {
    const map = useMap();

    const coordinates = () => {
      return activities
        .filter((activity) => activity.completed === false)
        .map((activities) => {
          const coords = activities.location.coordinates;
          return [coords.lat, coords.lon];
        });
    };

    const coords = coordinates();

    useEffect(() => {
      if (coords.length > 0) {
        map.fitBounds(coords, { padding: [20, 20] });
      }
    }, [map, coords]);

    useEffect(() => {
      if (scroll) {
        map.scrollWheelZoom.enable();
      } else {
        map.scrollWheelZoom.disable();
      }
    }, [map, scroll]);

    return null;
  };

  const createNumberedIcon = (number, completed) => {
    return L.divIcon({
      html: `<div>${number}</div>`,
      className: `map-marker ${completed && "bg-gray-500"}`,
      iconSize: [30, 30],
    });
  };

  return (
    <MapContainer
      className="w-full h-[500px]"
      zoom={3}
      center={firstCoords}
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
      />
      <MapUpdater />
      <ZoomControl position="bottomright" />
      <MarkerClusterGroup ref={clusterGroupRef}>
        {filteredActivities.map((activity, idx) => {
          const coords = activity.location.coordinates;
          const nextCoords =
            filteredActivities[idx + 1] &&
            filteredActivities[idx + 1].location.coordinates;

          return (
            <Marker
              key={activity._id}
              position={[coords.lat, coords.lon]}
              icon={createNumberedIcon(idx + 1, activity.completed)}
              id={activity._id}
            >
              <Popup>
                <b>
                  {activity.activity} @ {activity.location.name}
                </b>
                <p>
                  {convertDate(activity.datetime)} @{" "}
                  {getTime(activity.datetime)}
                </p>
                <p>
                  Coordinates (Lat, Lon): {coords.lat}, {coords.lon}
                </p>
                {nextCoords && (
                  <a
                    href={`https://www.google.com/maps/dir/${coords.lat},${coords.lon}/${nextCoords.lat},${nextCoords.lon}`}
                    target="_blank"
                    rel="noopener noreferer"
                    className="link-button flex border-t py-2"
                  >
                    Route to next location
                  </a>
                )}
                <div className="flex items-center justify-between border-t py-2">
                  <button
                    className="link-button mr-2"
                    onClick={() => {
                      setActivityId(activity._id);
                      setShowMap(false);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="link-button"
                    onClick={() => setModal(activity._id)}
                  >
                    Delete
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
      <Polyline positions={lineMap} color="rgb(247 183 51)" />
    </MapContainer>
  );
}
