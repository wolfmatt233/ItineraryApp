import { MapContainer, Polyline, TileLayer, ZoomControl } from "react-leaflet";
import { useActivity } from "./Activities";
import { sortDates } from "../functions/mapFunctions";
import MapMarkers from "./MapMarkers";
import MapUpdater from "./MapUpdater";

export default function ActivityMap({ activities }) {
  const { filterDate } = useActivity();
  const lineMap = sortDates(activities).map((activity) => [
    activity.locationLat,
    activity.locationLon,
  ]);
  const boundsMap = () => {
    let filtered = sortDates(activities);

    if (filterDate === "") {
      filtered = filtered.filter(
        (activity) => activity.completed === 0 || !activity.completed
      );
    }

    return filtered.map((activity) => {
      return [activity.locationLat, activity.locationLon];
    });
  };

  const bounds = boundsMap();

  return (
    <MapContainer
      className="w-full h-[500px]"
      zoom={3}
      center={bounds.length > 0 ? bounds[0] : [0, 0]}
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
      />
      <MapUpdater activities={activities} />
      <ZoomControl position="bottomright" />
      <MapMarkers activities={activities} />

      <Polyline positions={lineMap} color="rgb(247 183 51)" />
    </MapContainer>
  );
}
