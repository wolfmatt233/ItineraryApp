import { useAuth } from "../../../context/AuthContext";

export const apiRequests = () => {
  const { refreshLogin } = useAuth();

  // Itinerary CRUD api calls

  const createItinerary = async (itinerary, hasRefreshed = false) => {
    try {
      const response = await fetch("http://localhost:5000/api/itineraries", {
        method: "POST",
        body: JSON.stringify(itinerary),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 403 && !hasRefreshed) {
        await refreshLogin();
        return createItinerary(itinerary, true);
      }

      return { response: response, data: data };
    } catch (error) {
      console.log(error);
      alert("Request failed.");
    }
  };

  const fetchItineraries = async (hasRefreshed = false) => {
    try {
      const response = await fetch("http://localhost:5000/api/itineraries", {
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
      const response = await fetch(
        `http://localhost:5000/api/itineraries/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

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
    try {
      const response = await fetch(
        `http://localhost:5000/api/itineraries/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(itinerary),
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.status === 403 && !hasRefreshed) {
        await refreshLogin();
        return updateItinerary(id, itinerary, true);
      }

      return { response: response, data: data };
    } catch (error) {
      console.log(error);
      alert("Request failed.");
    }
  };

  const deleteItinerary = async (id, hasRefreshed = false) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/itineraries/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 403 && !hasRefreshed) {
        await refreshLogin();
        return deleteItinerary(id, true);
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
  };
};
