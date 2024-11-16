import { useEffect, useState } from "react";
import { getTime, removeTime } from "../../functions/formatDate";
import { useItinerary } from "../../pages/Itinerary";
import { apiRequests } from "../../functions/apiRequests";

export default function EditActivity({ activityId, setActivityId }) {
  const { id, itinerary, setItinerary, setShowMap } = useItinerary();
  const { updateItinerary } = apiRequests();
  const [activity, setActivity] = useState(
    itinerary.activities.filter((activity) => activity._id === activityId)[0]
  );
  const [datetime, setDatetime] = useState({
    date: removeTime(activity.datetime),
    time: activity.datetime.split("T")[1].replace(/:00$/, ""),
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    setActivity((prevData) => {
      if (name === "locationName") {
        return {
          ...prevData,
          location: {
            ...prevData.location,
            name: value,
          },
        };
      }

      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const { ...restOfActivity } = activity;

    const activityWithTime = {
      ...restOfActivity,
      datetime: `${datetime.date}T${datetime.time}:00`,
    };

    // Replace old activity with new one
    const updatedItinerary = {
      ...itinerary,
      activities: itinerary.activities.map((activity) =>
        activity._id === activityId ? activityWithTime : activity
      ),
    };

    const res = await updateItinerary(id, updatedItinerary);
    const { response, data } = res;

    if (response.ok) {
      setItinerary(data);
      handleClose();
    } else {
      refreshLogin();
      handleSave();
    }
  };

  const handleClose = (e) => {
    setActivityId(false);
    setShowMap(true);
  };

  return (
    <form className="flex flex-col">
      <p className="text-lg font-semibold">Edit Activity</p>
      <label htmlFor="locationName">Location Name</label>
      <input
        type="text"
        name="locationName"
        className="basic-input"
        onChange={handleChange}
        value={activity.location.name}
      />
      <label htmlFor="date">Date</label>
      <input
        type="date"
        name="date"
        min={removeTime(itinerary.startDate)}
        max={removeTime(itinerary.endDate)}
        className="basic-input"
        onChange={(e) =>
          setDatetime((prev) => {
            return {
              ...prev,
              date: e.target.value,
            };
          })
        }
        value={datetime.date}
      />
      <label htmlFor="time">Time</label>
      <input
        type="time"
        name="time"
        className="basic-input"
        onChange={(e) =>
          setDatetime((prev) => {
            return {
              ...prev,
              time: e.target.value,
            };
          })
        }
        value={datetime.time}
      />
      <label htmlFor="activity">Activity</label>
      <input
        type="text"
        name="activity"
        className="basic-input"
        onChange={handleChange}
        value={activity.activity}
      />
      <label htmlFor="notes">Notes</label>
      <textarea
        name="notes"
        rows={4}
        className="basic-input"
        onChange={handleChange}
        value={activity.notes}
      ></textarea>
      <div className="flex items-center">
        <button
          type="button"
          className="h-10 border border-gray-300 hover:bg-gray-200 mr-2 w-1/2"
          onClick={handleClose}
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
  );
}
