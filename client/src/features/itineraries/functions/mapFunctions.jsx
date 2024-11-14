import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const generateLines = (activities) => {
  return activities
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    .map((activities) => {
      const coords = activities.location.coordinates;
      return [coords.lat, coords.lon];
    });
};

export function FitBounds({ activities }) {
  const map = useMap();
  const coordinates = activities
    .filter((activity) => activity.completed === false)
    .map((activities) => {
      const coords = activities.location.coordinates;
      return [coords.lat, coords.lon];
    });

  useEffect(() => {
    if (coordinates.length) {
      map.fitBounds(coordinates, { padding: [20, 20] });
    }
  }, [map, coordinates]);

  return null;
}

export const clickMarker = (clusterGroupRef, id) => {
  const layers = clusterGroupRef.current.getLayers();

  layers.forEach((layer) => {
    if (layer.options.id === id) {
      clusterGroupRef.current.zoomToShowLayer(layer, () => {
        layer.openPopup();
      });
    }
  });
};

export const createNumberedIcon = (number, completed) => {
  return L.divIcon({
    html: `<div>${number}</div>`,
    className: `map-marker ${completed && "bg-gray-500"}`,
    iconSize: [30, 30],
  });
};
