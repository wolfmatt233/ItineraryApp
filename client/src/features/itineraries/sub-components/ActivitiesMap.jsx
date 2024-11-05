import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import L from "leaflet";
import { convertDate } from "../functions/formatDate";
import { getFirstActivity } from "../functions/getFirstActivity";

export default function ActivitiesMap({ itinerary }) {
  const firstCoords = getFirstActivity(itinerary.activities);
  const lineMap = itinerary.activities
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((activities) => {
      const coords = activities.location.coordinates;
      return [coords.lat, coords.lon];
    });

  const createNumberedIcon = (number, completed) => {
    return L.divIcon({
      html: `<div>${number}</div>`,
      className: `map-marker ${completed && "bg-gray-500"}`,
      iconSize: [30, 30],
    });
  };

  return (
    <div className="-mx-4 sm:mx-0">
      <MapContainer
        className="w-full h-[500px]"
        center={firstCoords}
        zoom={4}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        />

        {itinerary.activities.map((activity, idx) => {
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
              </Popup>
            </Marker>
          );
        })}

        <Polyline positions={lineMap} color="rgb(247 183 51)" />
      </MapContainer>
    </div>
  );
}
