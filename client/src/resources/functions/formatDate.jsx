export const formatDate = (date) => {
  if (!date) return "";
  if (date instanceof Date) date = date.toISOString();

  const splitDate = date.split("T")[0].split("-");
  return `${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`;
};

export const removeTime = (date) => {
  if (!date) return "";
  if (date instanceof Date) date = date.toISOString();

  return date.split("T")[0];
};

export const getTime = (date) => {
  if (!date) return "";
  if (date instanceof Date) date = date.toISOString();

  const convertDate = new Date(date);
  let hours = convertDate.getHours();
  const minutes = convertDate.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  const formattedMins = minutes < 10 ? `0${minutes}` : minutes;
  const newTime = `${hours}:${formattedMins} ${ampm}`;
  return newTime;
};

export const convertDate = (date) => {
  if (!date) return "";
  if (date instanceof Date) date = date.toISOString();

  const newDate = new Date(date);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(newDate);
};
