import { usePage } from "../App";
import { useAuth } from "../context/AuthContext";

export const apiRequests = () => {
  const { setPageLoading } = usePage();
  const { refreshLogin } = useAuth();
  const authHeader = `Bearer ${localStorage.getItem("accessToken")}`;
  const apiUrl = import.meta.env.VITE_API_URL;

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
      console.log(error);
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

  // Itinerary CRUD api calls

  const createItinerary = async (itinerary) => {
    setPageLoading(true);
    const fetchFunction = async (itinerary) =>
      fetch(`${apiUrl}/itineraries`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itinerary),
      });

    return retryForbidden(fetchFunction, [itinerary]);
  };

  const fetchItineraries = async () => {
    const fetchFunction = async () =>
      fetch(`${apiUrl}/itineraries`, {
        headers: {
          Authorization: authHeader,
        },
      });

    return retryForbidden(fetchFunction, []);
  };

  const fetchItinerary = async (id) => {
    const fetchFunction = (id) =>
      fetch(`${apiUrl}/itineraries/${id}`, {
        headers: {
          Authorization: authHeader,
        },
      });

    return retryForbidden(fetchFunction, [id]);
  };

  const updateItinerary = async (id, itinerary) => {
    setPageLoading(true);
    const fetchFunction = (id, itinerary) =>
      fetch(`${apiUrl}/itineraries/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itinerary),
      });

    return retryForbidden(fetchFunction, [id, itinerary]);
  };

  const deleteItinerary = async (id) => {
    setPageLoading(true);
    const fetchFunction = (id) =>
      fetch(`${apiUrl}/itineraries/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: authHeader,
        },
      });

    return retryForbidden(fetchFunction, [id]);
  };

  // Activities CRUD api calls

  const createActivity = async (id, activity) => {
    setPageLoading(true);
    const fetchFunction = (id, activity) =>
      fetch(`${apiUrl}/activities/${id}`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activity),
      });

    return retryForbidden(fetchFunction, [id, activity]);
  };

  const fetchActivities = async (id) => {
    const fetchFunction = (id) =>
      fetch(`${apiUrl}/itineraries/${id}/activities`, {
        headers: {
          Authorization: authHeader,
        },
      });

    return retryForbidden(fetchFunction, [id]);
  };

  const updateActivity = async (id, activity) => {
    setPageLoading(true);
    const fetchFunction = (id, activity) =>
      fetch(`${apiUrl}/activities/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activity),
      });

    return retryForbidden(fetchFunction, [id, activity]);
  };

  const deleteActivity = async (id) => {
    setPageLoading(true);
    const fetchFunction = (id) =>
      fetch(`${apiUrl}/activities/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: authHeader,
        },
      });

    return retryForbidden(fetchFunction, [id]);
  };

  return {
    createItinerary,
    fetchItineraries,
    fetchItinerary,
    updateItinerary,
    deleteItinerary,
    createActivity,
    updateActivity,
    fetchActivities,
    deleteActivity,
  };
};
