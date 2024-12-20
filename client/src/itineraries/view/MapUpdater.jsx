import { useMap } from "react-leaflet";
import { useActivity } from "./Activities";
import { useEffect } from "react";

export default function MapUpdater({ activities, boundsMap }) {
  const { scroll } = useActivity();
  const map = useMap();

  useEffect(() => {
    const bounds = boundsMap(activities);

    if (bounds.length > 0) {
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
