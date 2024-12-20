import { usePage } from "../App";
import { apiRequests } from "./apiRequests";

export const activityRequests = () => {
  const { setPageLoading } = usePage();
  const { retryForbidden } = apiRequests();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Activities CRUD api calls

  const createActivity = async (id, activity) => {
    setPageLoading(true);
    const fetchFunction = (id, activity) =>
      fetch(`${apiUrl}/activities/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

    return retryForbidden(fetchFunction, [id]);
  };

  return {
    createActivity,
    updateActivity,
    fetchActivities,
    deleteActivity,
  };
};
