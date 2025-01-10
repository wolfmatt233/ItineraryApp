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
      fetch(`${apiUrl}/itineraries/${id}/activities`, {
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

  const updateActivity = async (itineraryId, actId, activity) => {
    setPageLoading(true);
    const fetchFunction = (itineraryId, actId, activity) =>
      fetch(`${apiUrl}/itineraries/${itineraryId}/activities/${actId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activity),
      });

    return retryForbidden(fetchFunction, [itineraryId, actId, activity]);
  };

  const deleteActivity = async (itineraryId, actId) => {
    setPageLoading(true);
    const fetchFunction = (id) =>
      fetch(`${apiUrl}/itineraries/${itineraryId}/activities/${actId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

    return retryForbidden(fetchFunction, [itineraryId, actId]);
  };

  return {
    createActivity,
    updateActivity,
    fetchActivities,
    deleteActivity,
  };
};
