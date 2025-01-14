export const getFirstActivity = (activities) => {
  if (activities.length == 0) return [0, 0];

  const firstIncomplete = activities.find(
    (activity) => activity.complete === false
  );

  if (firstIncomplete) {
    console.log(firstIncomplete);
    const coords = firstIncomplete.location.coordinates;
    return [coords.lat, coords.lon];
  }

  const firstDate = activities
    .filter((activity) => activity.completed === false)
    .sort((a, b) => new Date(a.date) - new Date(b.date)[0]);

  const coords = firstDate[0].location.coordinates;
  return [coords.lat, coords.lon];
};

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

export const sortDates = (activities) => {
  return activities.sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const createNumberedIcon = (number, completed) => {
  return L.divIcon({
    html: `<div>${number}</div>`,
    className: `map-marker ${completed && "bg-gray-500"}`,
    iconSize: [30, 30],
  });
};
