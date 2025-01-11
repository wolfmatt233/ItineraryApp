import { usePage } from "../App";
import { useAuth } from "../context/AuthContext";

export const apiRequests = () => {
  const { setPageLoading } = usePage();
  const { refreshLogin } = useAuth();

  // If 404, try refreshing token, if not complete the given request
  const retryForbidden = async (fetchFunction, args, hasRefreshed = false) => {
    // if id and _id exist, remove _id (for PHP api)
    args.forEach((arg) => {
      if (typeof arg === "object") {
        if (arg.id && arg._id) {
          delete arg._id;
        }
      }
    });

    try {
      const response = await fetchFunction(...args);
      const data = await response.json();

      if (response.status === 403 && !hasRefreshed) {
        await refreshLogin();
        return retryForbidden(fetchFunction, [...args], true);
      }

      setPageLoading(false);

      return { response, data: addUnderscoreId(data) };
    } catch (error) {
      setPageLoading(false);
    }
  };

  //add _id for client reading (PHP api)
  const addUnderscoreId = (data) => {
    if (Array.isArray(data)) {
      // If it's an array, apply recursively to each item
      return data.map(addUnderscoreId);
    } else if (typeof data === "object" && data !== null) {
      // If it's an object, add `_id` and recurse
      const transformed = {};
      for (const key in data) {
        const value = data[key];
        transformed[key] = addUnderscoreId(value); // Recurse for nested data
      }
      // Add `_id` if `id` exists and `_id` doesn't
      if (data.id && !data._id) {
        transformed["_id"] = data.id;
      }
      return transformed;
    }
    // Return primitive values unchanged
    return data;
  };

  return { retryForbidden, addUnderscoreId };
};
