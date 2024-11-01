import { useEffect, useState } from "react";

export default function AddActivity({
  id,
  setAddActivity,
  itinerary,
  getItinerary,
  setItinerary,
}) {
  const [newActivity, setNewActivity] = useState({
    date: "",
    time: "",
    activity: "",
    location: {
      name: "",
      coordinates: {
        lat: "",
        lon: "",
      },
    },
    notes: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    setNewActivity((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const updatedItinerary = {
      ...itinerary,
      activities: [...itinerary.activities, newActivity],
    };
    try {
      const response = await fetch(
        `http://localhost:5000/api/itineraries/${id}`,
        {
          method: "POST",
          body: { itinerary },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setItinerary(data);
      }
    } catch (error) {
      //
      alert("Activity creation failed.");
    }
  };

  return (
    <form className="flex flex-col w-1/2 mx-auto">
      <p>Select location from map</p>
      <p>Location gives name & coordinates</p>

      <p>Activity Form</p>
      <label htmlFor="date">Date</label>
      <input
        type="date"
        name="date"
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
      <input type="text" className="basic-input" onChange={handleChange} />
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
          onClick={() => setAddActivity(false)}
        >
          Cancel
        </button>
        <button
          className="h-10 border text-white bg-[#4ABDAC] hover:bg-[#F7B733] mr-2 w-1/2"
          onClick={handleSave}
        >
          Add Activity
        </button>
      </div>
    </form>
  );
}
