export const hasEmptyInputs = (obj) => {
  return Object.values(obj).some((value) => {
    // Check for empty strings or null/undefined values
    return value === "" || value === null || value === undefined;
  });
};
