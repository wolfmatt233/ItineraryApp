import { useMap } from "react-leaflet";
import { useActivity } from "./Activities";
import { useEffect } from "react";

export default function MapUpdater({ activities }) {
  const { filterDate, scroll } = useActivity();
  const map = useMap();

  useEffect(() => {
    const updatedBounds = activities.map((activity) => [
      activity.locationLat,
      activity.locationLon,
    ]);

    const incompletedBounds = activities
      .filter((activity) => activity.completed === 0 || !activity.completed)
      .map((activity) => [activity.locationLat, activity.locationLon]);

    if (updatedBounds.length > 0) {
      const bounds = filterDate != "" ? updatedBounds : incompletedBounds;
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, activities]);

  useEffect(() => {
    if (scroll) {
      map.scrollWheelZoom.enable();
    } else {
      map.scrollWheelZoom.disable();
    }
  }, [map, scroll]);

  return null;
}
