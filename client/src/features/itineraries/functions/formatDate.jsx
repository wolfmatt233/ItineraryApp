export const formatDate = (date) => {
  if (!date) return "";
  let splitDate = date.split("T")[0].split("-");
  return `${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`;
};

export const removeTime = (date) => {
  if (!date) return "";
  return date.split("T")[0];
};
