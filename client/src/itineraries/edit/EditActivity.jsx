import { useState } from "react";
import { useItinerary } from "../../pages/itinerary/Itinerary";
import { apiRequests } from "../../requests/apiRequests";
import { removeTime } from "../functions/formatDate";

export default function EditActivity({ activityId, setActivityId }) {
  const { id, itinerary, setItinerary } = useItinerary();
  const { updateActivity } = apiRequests();
  const [updatedActivity, setUpdatedActivity] = useState(
    itinerary.activities.filter((activity) => activity._id === activityId)[0]
  );
  const [datetime, setDatetime] = useState({
    date: updatedActivity.date.split("T")[0],
    time: updatedActivity.date.split("T")[1].replace(/:00$/, ""),
  });
  const [editToggle, setEditToggle] = useState(false);

  const handleChange = (e) => {
    let { name, value, checked, type } = e.target;

    if (type === "checkbox") {
      setUpdatedActivity((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else if (name === "date" || name === "time") {
      setDatetime((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    } else {
      setUpdatedActivity((prevData) => {
        return {
          ...prevData,
          [name]: value,
        };
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const activityWithTime = {
      ...updatedActivity,
      date: `${datetime.date}T${datetime.time}:00`,
    };

    const res = await updateActivity(activityWithTime._id, activityWithTime);
    const { response, data } = res;

    if (response.ok) {
      const updatedItinerary = {
        ...itinerary,
        activities: itinerary.activities.map((activity) =>
          activity._id === activityId ? data : activity
        ),
      };

      setItinerary(updatedItinerary);
      setActivityId(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[5000]">
      <div className="modal w-3/4  bg-white">
        <form className="flex flex-col">
          <p className="text-lg font-semibold">Edit Activity</p>
          {editToggle ? (
            <>
              <label htmlFor="locationName">Location Name</label>
              <input
                type="text"
                name="locationName"
                className="basic-input"
                onChange={handleChange}
                value={updatedActivity.locationName}
              />
              <label htmlFor="locationLat">Latitude</label>
              <input
                type="number"
                name="locationLat"
                className="basic-input"
                value={updatedActivity.locationLat}
                onChange={handleChange}
              />
              <label htmlFor="locationLon">Longitude</label>
              <input
                type="number"
                name="locationLon"
                className="basic-input"
                value={updatedActivity.locationLon}
                onChange={handleChange}
              />
            </>
          ) : (
            <div className="flex items-center">
              <p>
                Location: <b>{updatedActivity.locationName}</b>
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
            className="basic-input"
            onChange={handleChange}
            value={datetime.date}
          />
          <label htmlFor="time">Time</label>
          <input
            type="time"
            name="time"
            className="basic-input"
            onChange={handleChange}
            value={datetime.time}
          />
          <label htmlFor="activity">Activity</label>
          <input
            type="text"
            name="activity"
            className="basic-input"
            onChange={handleChange}
            value={updatedActivity.activity}
          />
          <div>
            <label htmlFor="completed">Completed</label>
            <input
              type="checkbox"
              name="completed"
              className="ml-2"
              checked={updatedActivity.completed}
              onChange={handleChange}
            />
          </div>
          <label htmlFor="notes">Notes</label>
          <textarea
            name="notes"
            rows={4}
            className="basic-input"
            onChange={handleChange}
            value={updatedActivity.notes}
          ></textarea>
          <div className="flex items-center">
            <button
              type="button"
              className="h-10 border border-gray-300 hover:bg-gray-200 mr-2 w-1/2"
              onClick={() => setActivityId(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 border text-white bg-[#4ABDAC] hover:bg-[#F7B733] w-1/2"
              onClick={handleUpdate}
            >
              Update Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
