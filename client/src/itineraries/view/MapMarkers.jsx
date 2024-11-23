import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { convertDate, getTime } from "../functions/formatDate";
import { useItinerary } from "../../pages/itinerary/Itinerary";
import { useActivity } from "./Activities";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { sortDates } from "../functions/mapFunctions";
import { useEffect } from "react";

export default function MapMarkers({ activities }) {
  const { setShowMap, setActivityId } = useItinerary();
  const { clusterGroupRef, setModal } = useActivity();

  const createNumberedIcon = (number, completed) => {
    return L.divIcon({
      html: `<div>${number}</div>`,
      className: `map-marker ${completed && "bg-gray-500"}`,
      iconSize: [30, 30],
    });
  };

  return (
    <>
      {activities.length > 0 && (
        <MarkerClusterGroup ref={clusterGroupRef} key={"markerCluster"}>
          {sortDates(activities).map((activity, idx) => {
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
      )}
    </>
  );
}
