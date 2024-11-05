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

export const getLastActivity = (activities) => {
  if (activities.length == 0) return [0, 0];
  
  const lastActivity = activities[activities.length - 1].location.coordinates;

  if (lastActivity) {
    return [lastActivity.lat, lastActivity.lon];
  }

  return [0, 0];
};
