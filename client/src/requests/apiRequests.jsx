import { usePage } from "../App";
import { useAuth } from "../context/AuthContext";

export const apiRequests = () => {
  const { setPageLoading } = usePage();
  const { refreshLogin } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Itinerary CRUD api calls

  const createItinerary = async (itinerary, hasRefreshed = false) => {
    setPageLoading(true);
    try {
      const response = await fetch(`${apiUrl}/itineraries`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itinerary),
      });

      const data = await response.json();

      if (response.status === 403 && !hasRefreshed) {
        await refreshLogin();
        return createItinerary(itinerary, true);
      }

      setPageLoading(false);
      return { response: response, data: data };
    } catch (error) {
      setPageLoading(false);
      console.log(error);
      alert("Request failed.");
    }
  };

  const fetchItineraries = async (hasRefreshed = false) => {
    try {
      const response = await fetch(`${apiUrl}/itineraries`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await response.json();

      if (response.status === 403 && !hasRefreshed) {
        await refreshLogin();
        return fetchItineraries(true);
      }

      return { response: response, data: data };
    } catch (error) {
      console.log(error);
      alert("Request failed.");
    }
  };

  const fetchItinerary = async (id, hasRefreshed = false) => {
    try {
      const response = await fetch(`${apiUrl}/itineraries/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await response.json();

      if (response.status === 403 && !hasRefreshed) {
        await refreshLogin();
        return fetchItinerary(id, true);
      }

      return { response: response, data: data };
    } catch (error) {
      console.log(error);
      alert("Request failed.");
    }
  };

  const updateItinerary = async (id, itinerary, hasRefreshed = false) => {
    setPageLoading(true);
    try {
      const response = await fetch(`${apiUrl}/itineraries/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itinerary),
      });

      const data = await response.json();

      if (response.status === 403 && !hasRefreshed) {
        await refreshLogin();
        return updateItinerary(id, itinerary, true);
      }

      setPageLoading(false);
      return { response: response, data: data };
    } catch (error) {
      setPageLoading(false);
      console.log(error);
      console.log("help", error.message);
      alert("Request failed.");
    }
  };

  const deleteItinerary = async (id, hasRefreshed = false) => {
    setPageLoading(true);
    try {
      const response = await fetch(`${apiUrl}/itineraries/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await response.json();

      if (response.status === 403 && !hasRefreshed) {
        await refreshLogin();
        return deleteItinerary(id, true);
      }

      setPageLoading(false);
      return { response: response, data: data };
    } catch (error) {
      setPageLoading(false);
      console.log(error);
      alert("Request failed.");
    }
  };

  // Activities CRUD api calls

  const createActivity = async (id, activity, hasRefreshed = false) => {
    setPageLoading(true);
    try {
      const response = await fetch(`${apiUrl}/itineraries/${id}/activities`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activity),
      });

      const data = await response.json();

      if (response.status === 403 && !hasRefreshed) {
        await refreshLogin();
        return createActivity(id, activity, true);
      }

      setPageLoading(false);
      return { response: response, data: data };
    } catch (error) {
      setPageLoading(false);
      console.log(error);
      alert("Request failed.");
    }
  };

  const updateActivity = async (activity, hasRefreshed = false) => {
    setPageLoading(true);
    try {
      const response = await fetch(`${apiUrl}/activities/${activity._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activity),
      });

      const data = await response.json();

      if (response.status === 403 && !hasRefreshed) {
        await refreshLogin();
        return updateActivity(activity, true);
      }

      setPageLoading(false);
      return { response: response, data: data };
    } catch (error) {
      setPageLoading(false);
      console.log(error);
      alert("Request failed.");
    }
  };

  const fetchActivities = async (id, hasRefreshed = false) => {
    try {
      const response = await fetch(`${apiUrl}/itineraries/${id}/activities`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await response.json();

      if (response.status === 403 && !hasRefreshed) {
        await refreshLogin();
        return fetchActivities(id, true);
      }

      return { response: response, data: data };
    } catch (error) {
      console.log(error);
      alert("Request failed.");
    }
  };

  const deleteActivity = async (id, hasRefreshed = false) => {
    try {
      const response = await fetch(`${apiUrl}/activities/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await response.json();

      if (response.status === 403 && !hasRefreshed) {
        await refreshLogin();
        return deleteActivity(id, true);
      }

      return { response: response, data: data };
    } catch (error) {
      console.log(error);
      alert("Request failed.");
    }
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
