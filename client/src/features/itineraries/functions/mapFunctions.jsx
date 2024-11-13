import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export const generateLines = (activities) => {
  return activities
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((activities) => {
      const coords = activities.location.coordinates;
      return [coords.lat, coords.lon];
    });
};

export const generateBounds = (activities) => {
  return activities
    .filter((activity) => activity.completed === false)
    .map((activities) => {
      const coords = activities.location.coordinates;
      return [coords.lat, coords.lon];
    });
};

export function FitBounds({ coordinates }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length) {
      map.fitBounds(coordinates);
    }
  }, [map, coordinates]);

  return null;
}

export const createNumberedIcon = (number, completed) => {
  return L.divIcon({
    html: `<div>${number}</div>`,
    className: `map-marker ${completed && "bg-gray-500"}`,
    iconSize: [30, 30],
  });
};

export const clickMarker = (lat, lon, clusterGroupRef) => {
  const coords = [parseFloat(lat), parseFloat(lon)];

  const layers = clusterGroupRef.current.getLayers();

  layers.forEach((layer) => {
    if (
      layer.getLatLng().lat === coords[0] &&
      layer.getLatLng().lng === coords[1]
    ) {
      layer.openPopup();
    }
  });
};
