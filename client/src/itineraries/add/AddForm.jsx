import { useState } from "react";
import { useItinerary } from "../../pages/itinerary/Itinerary";
import { removeTime } from "../functions/formatDate";
import { activityRequests } from "../../requests/activityRequests";

export default function AddForm({ setLocation, location }) {
  const { id, itinerary, setItinerary, setShowMap } = useItinerary();
  const { createActivity } = activityRequests();
  const [newActivity, setNewActivity] = useState({
    date: "",
    activity: "",
    locationName: location === "none" ? "" : location.name.split(",")[0],
    locationLat: location === "none" ? 0 : location.position[0],
    locationLon: location === "none" ? 0 : location.position[1],
    notes: "",
    completed: false,
  });
  const [datetime, setDatetime] = useState({
    date: itinerary.startDate.split("T")[0],
    time: "",
  });
  const [editToggle, setEditToggle] = useState(() => {
    return location === "none" ? true : false;
  });

  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;

    if (name === "date" || name === "time") {
      setDatetime((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setNewActivity((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleClose = (e) => {
    setLocation(false);
    setShowMap(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const { date, time } = datetime;

    const activityWithTime = {
      ...newActivity,
      date: `${date}T${time}:00`,
    };

    const res = await createActivity(id, activityWithTime);
    const { response, data } = res;

    if (response.ok) {
      const updatedItinerary = {
        ...itinerary,
        activities: [...itinerary.activities, data],
      };
      setItinerary(updatedItinerary);
      handleClose();
    } else {
      alert("Failed to add activity.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[5000]">
      <div className="modal w-3/4 bg-white">
        <form className="flex flex-col">
          <p className="page-title text-lg">Add Location</p>
          {editToggle ? (
            <>
              <label htmlFor="locationName">Location</label>
              <input
                type="text"
                name="locationName"
                className="basic-input"
                value={newActivity.locationName}
                onChange={handleChange}
              />
              <label htmlFor="locationLat">Latitude</label>
              <input
                type="number"
                name="locationLat"
                className="basic-input"
                value={newActivity.locationLat}
                onChange={handleChange}
              />
              <label htmlFor="locationLon">Longitude</label>
              <input
                type="number"
                name="locationLon"
                className="basic-input"
                value={newActivity.locationLon}
                onChange={handleChange}
              />
            </>
          ) : (
            <div className="flex items-center">
              <p>
                New Location Selected: <b>{newActivity.locationName}</b>
              </p>
              <i
                className="fa-solid fa-pen-to-square ml-2 basic-button h-7 w-7 flex items-center justify-center cursor-pointer"
                onClick={() => setEditToggle(true)}
              ></i>
            </div>
          )}
          <label htmlFor="date">Date</label>
          <input
            type="date"
            name="date"
            min={removeTime(itinerary.startDate)}
            max={removeTime(itinerary.endDate)}
            value={datetime.date}
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
          <div>
            <label htmlFor="completed">Completed</label>
            <input
              type="checkbox"
              name="completed"
              className="ml-2"
              checked={newActivity.completed}
              onChange={handleChange}
            />
          </div>
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
      </div>
    </div>
  );
}
