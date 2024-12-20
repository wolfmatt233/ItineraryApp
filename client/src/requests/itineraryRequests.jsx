import { usePage } from "../App";
import { apiRequests } from "./apiRequests";

export const itineraryRequests = () => {
  const { setPageLoading } = usePage();
  const { retryForbidden } = apiRequests();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Itinerary CRUD api calls

  const createItinerary = async (itinerary) => {
    setPageLoading(true);
    const fetchFunction = async (itinerary) =>
      fetch(`${apiUrl}/itineraries`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

    return retryForbidden(fetchFunction, []);
  };

  const fetchItinerary = async (id) => {
    const fetchFunction = (id) =>
      fetch(`${apiUrl}/itineraries/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
