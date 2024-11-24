export const hasEmptyInputs = (obj) => {
  return Object.entries(obj).some(([key, value]) => {
    // Exclude "notes" from the check
    if (key === "notes") {
      return false;
    }
    // Check for empty strings or null/undefined values
    return value === "" || value === null || value === undefined;
  });
};
