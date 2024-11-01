export const formatDate = (date) => {
  if (!date) return "";
  if (date instanceof Date) date = date.toISOString();
  let splitDate = date.split("T")[0].split("-");
  return `${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`;
};

export const removeTime = (date) => {
  if (!date) return "";
  if (date instanceof Date) date = date.toISOString();
  return date.split("T")[0];
};
