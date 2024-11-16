import { useState } from "react";
import { removeTime } from "../../functions/formatDate";
import { useItinerary } from "../../pages/Itinerary";
import { apiRequests } from "../../functions/apiRequests";

export default function AddForm({ setLocation, location }) {
  const { id, itinerary, setItinerary, setShowMap } = useItinerary();
  const { updateItinerary } = apiRequests();
  const [editToggle, setEditToggle] = useState(() => {
    return location === "none" ? true : false;
  });
  const [newActivity, setNewActivity] = useState({
    date: "",
    time: "",
    activity: "",
    location: {
      name: location === "none" ? "" : location.name.split(",")[0],
      coordinates: {
        lat: location === "none" ? 0 : location.position[0],
        lon: location === "none" ? 0 : location.position[1],
      },
    },
    notes: "",
    completed: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "coords_lat" || name === "coords_lon") {
      setNewActivity((prevData) => ({
        ...prevData,
        location: {
          ...prevData.location,
          coordinates: {
            ...prevData.location.coordinates,
            [name === "coords_lat" ? "lat" : "lon"]: value,
          },
        },
      }));
    } else if (name === "location") {
      setNewActivity((prevData) => ({
        ...prevData,
        location: {
          ...prevData.location,
          name: value,
        },
      }));
    } else {
      setNewActivity((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleClose = (e) => {
    setLocation(false);
    setShowMap(true);
  };

  const handleEdit = () => {
    setEditToggle(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const { date, time, ...restOfActivity } = newActivity;

    const activityWithTime = {
      ...restOfActivity,
      datetime: `${date}T${time}:00`,
    };

    const updatedItinerary = {
      ...itinerary,
      activities: [...itinerary.activities, activityWithTime],
    };

    const res = await updateItinerary(id, updatedItinerary);
    const { response, data } = res;

    if (response.ok) {
      setItinerary(data);
      handleClose();
    } else {
      alert("Failed to add activity.");
    }
  };

  return (
    <form className="flex flex-col">
      <p className="page-title text-lg">Add Location</p>
      {editToggle ? (
        <>
          <label htmlFor="location">Location</label>
          <input
            type="text"
            name="location"
            className="basic-input"
            value={newActivity.location.name}
            onChange={handleChange}
          />
          <label htmlFor="coords_lat">Latitude</label>
          <input
            type="number"
            name="coords_lat"
            className="basic-input"
            value={newActivity.location.coordinates.lat}
            onChange={handleChange}
          />
          <label htmlFor="coords_lon">Longitude</label>
          <input
            type="number"
            name="coords_lon"
            className="basic-input"
            value={newActivity.location.coordinates.lon}
            onChange={handleChange}
          />
        </>
      ) : (
        <div className="flex items-center">
          <p>
            New Location Selected: <b>{newActivity.location.name}</b>
          </p>
          <i
            className="fa-solid fa-pen-to-square ml-2 basic-button h-7 w-7 flex items-center justify-center cursor-pointer"
            onClick={handleEdit}
          ></i>
        </div>
      )}
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
          type="button"
          className="h-10 border border-gray-300 hover:bg-gray-200 mr-2 w-1/2 cursor-pointer"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="h-10 border text-white bg-[#4ABDAC] hover:bg-[#F7B733] w-1/2"
          onClick={handleSave}
        >
          Add Activity
        </button>
      </div>
    </form>
  );
}
