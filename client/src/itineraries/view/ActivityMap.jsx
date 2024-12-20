import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import { useActivity } from "./Activities";
import { createNumberedIcon, sortDates } from "../functions/mapFunctions";
import MapUpdater from "./MapUpdater";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useItinerary } from "../../pages/itinerary/Itinerary";
import { convertDate, getTime } from "../functions/formatDate";

export default function ActivityMap({ activities }) {
  const { setShowMap, setActivityId } = useItinerary();
  const { clusterGroupRef, setModal, filterDate } = useActivity();
  const boundsMap = (activities) => {
    // Sort dates oldest to newest
    let sortedDates = sortDates(activities);

    // Check if every date is complete
    let areAllCompleted = sortedDates.every(
      (activity) => activity.completed === 1 || activity.completed
    );

    // If no filter and all are not complete
    // filter out completed activities for bounds
    if (filterDate === "" && !areAllCompleted) {
      sortedDates = sortedDates.filter(
        (activity) => activity.completed === 0 || !activity.completed
      );
    }

    const finalBounds = sortedDates.map((activity) => {
      return [activity.locationLat, activity.locationLon];
    });

    if (finalBounds.length > 0) {
      return finalBounds;
    } else {
      return [[40.6501681934524, -73.9996029760112]];
    }
  };
  const bounds = boundsMap(activities);

  return (
    <MapContainer
      className="h-[55vh] w-full"
      zoom={4}
      center={bounds[0]}
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <TileLayer
        attribution='Map tiles by <a href="https://www.arcgis.com/">Esri</a>, sourced from OpenStreetMap and other contributors.'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
      />
      <MapUpdater activities={activities} boundsMap={boundsMap} />
      <ZoomControl position="bottomright" />
      <Polyline positions={bounds} color="rgb(247 183 51)" />

      <MarkerClusterGroup ref={clusterGroupRef} key={activities.length}>
        {activities.length > 0 &&
          activities.map((activity, idx) => {
            const nextCoords = activities[idx + 1];

            return (
              <Marker
                key={activity._id}
                position={[activity.locationLat, activity.locationLon]}
                icon={createNumberedIcon(idx + 1, activity.completed)}
                id={activity._id}
              >
                <Popup>
                  <b>
                    {activity.activity} @ {activity.locationName}
                  </b>
                  <p>
                    {convertDate(activity.date)} @ {getTime(activity.date)}
                  </p>
                  <p>
                    Coordinates (Lat, Lon): {activity.locationLat},{" "}
                    {activity.locationLon}
                  </p>
                  {nextCoords && (
                    <a
                      href={`https://www.google.com/maps/dir/${activity.locationLat},${activity.locationLon}/${nextCoords.locationLat},${nextCoords.locationLon}`}
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
    </MapContainer>
  );
}
