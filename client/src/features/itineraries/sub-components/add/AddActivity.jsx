import { useEffect, useState } from "react";
import { removeTime } from "../../functions/formatDate";
import { useAuth } from "../../../../context/AuthContext";

export default function AddActivity({
  id,
  setLocation,
  location,
  setItinerary,
  itinerary,
  setShowMap,
}) {
  const { refreshLogin } = useAuth();
  const [newActivity, setNewActivity] = useState({
    date: "",
    time: "",
    activity: "",
    location: {
      name: location.name.split(",")[0],
      coordinates: {
        lat: location.position[0],
        lon: location.position[1],
      },
    },
    notes: "",
    completed: false,
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    setNewActivity((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClose = (e) => {
    setLocation(false);
    setShowMap(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const updatedTime = {
      ...newActivity,
      date: `${newActivity.date}T${newActivity.time}`,
    };

    const updatedItinerary = {
      ...itinerary,
      activities: [...itinerary.activities, updatedTime],
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/itineraries/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(updatedItinerary),
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setItinerary(data);
        handleClose();
      } else {
        refreshLogin();
        handleSave();
      }
    } catch (error) {
      console.log(error);
      alert("Activity creation failed.");
    }
  };

  return (
    <form className="flex flex-col">
      <p>
        New Location Selected: <b>{newActivity.location.name}</b>
      </p>
      <label htmlFor="date">Date</label>
      <input
        type="date"
        name="date"
        min={removeTime(itinerary.startDate)}
        max={removeTime(itinerary.endDate)}
        className="basic-input"
        onChange={handleChange}
      />
      <label htmlFor="time">Time</label>
      <input
        type="time"
        name="time"
        className="basic-input"
        onChange={handleChange}
      />
      <label htmlFor="activity">Activity</label>
      <input
        type="text"
        name="activity"
        className="basic-input"
        onChange={handleChange}
      />
      <label htmlFor="notes">Notes</label>
      <textarea
        name="notes"
        rows={4}
        className="basic-input"
        onChange={handleChange}
      ></textarea>
      <div className="flex items-center">
        <button
          className="h-10 border border-gray-300 hover:bg-gray-200 mr-2 w-1/2"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="h-10 border text-white bg-[#4ABDAC] hover:bg-[#F7B733] mr-2 w-1/2"
          onClick={handleSave}
        >
          Add Activity
        </button>
      </div>
    </form>
  );
}
