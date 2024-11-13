import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import { getFirstActivity } from "../functions/getFirstActivity";
import {
  generateLines,
  generateBounds,
  FitBounds,
  createNumberedIcon,
} from "../functions/mapFunctions";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useEffect, useRef, useState } from "react";
import ActivitiesList from "./view/ActivitiesList";
import ActivitiesButtons from "./view/ActivitiesButtons";
import { convertDate, removeTime } from "../functions/formatDate";

export default function ActivitiesMap({ itinerary, setModal, setShowMap }) {
  const [activities, setActivities] = useState(itinerary.activities);
  const [firstCoords, setFirstCoords] = useState(getFirstActivity(activities));
  const [lineMap, setLineMap] = useState(generateLines(activities));
  const [bounds, setBounds] = useState(generateBounds(activities));
  const clusterGroupRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    setFirstCoords(getFirstActivity(activities));
    setLineMap(generateLines(activities));
    setBounds(generateBounds(activities));
  }, [activities]);

  return (
    <div className="-mx-4 sm:mx-0 relative">
      <ActivitiesButtons
        itinerary={itinerary}
        setActivities={setActivities}
        setShowMap={setShowMap}
      />

      <ActivitiesList
        activities={activities}
        clusterGroupRef={clusterGroupRef}
        mapRef={mapRef}
      />

      <MapContainer
        className="w-full h-[500px]"
        center={firstCoords}
        zoom={3}
        scrollWheelZoom={false}
        ref={mapRef}
      >
        <FitBounds coordinates={bounds} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        />
        <MarkerClusterGroup ref={clusterGroupRef}>
          {activities.map((activity, idx) => {
            const coords = activity.location.coordinates;

            return (
              <Marker
                key={idx}
                position={[coords.lat, coords.lon]}
                icon={createNumberedIcon(idx + 1, activity.completed)}
              >
                <Popup>
                  <b>
                    {activity.activity} @ {activity.location.name}
                  </b>
                  <p>
                    {convertDate(activity.date)} @ {activity.time}
                  </p>
                  <p>
                    Coordinates (Lat, Lon): {coords.lat}, {coords.lon}
                  </p>
                  <button
                    className="link-button"
                    onClick={() => setModal(activity._id)}
                  >
                    Delete
                  </button>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
        <Polyline positions={lineMap} color="rgb(247 183 51)" />
      </MapContainer>
    </div>
  );
}
