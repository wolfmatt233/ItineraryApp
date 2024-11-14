import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import { convertDate, getTime, removeTime } from "../../functions/formatDate";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { createNumberedIcon, FitBounds, generateLines } from "../../functions/mapFunctions";
import { getFirstActivity } from "../../functions/getFirstActivity";
import { useFilter } from "../ActivityMap";

export default function ActivityMarkers({
  activities,
  setModal,
  setActivityId,
  clusterGroupRef,
}) {
  const { applyFilter } = useFilter();
  const filteredActivities = applyFilter();
  const firstCoords = getFirstActivity(filteredActivities);
  const lineMap = generateLines(filteredActivities);

  return (
    <MapContainer
      className="w-full h-[500px]"
      center={firstCoords}
      zoom={3}
      scrollWheelZoom={false}
    >
      <FitBounds activities={activities} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
      />
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
                    onClick={() => setActivityId(activity._id)}
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
