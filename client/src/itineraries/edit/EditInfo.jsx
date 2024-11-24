import { useState } from "react";
import { formatDate, removeTime } from "../functions/formatDate";
import { apiRequests } from "../../requests/apiRequests";
import { useItinerary } from "../../pages/itinerary/Itinerary";

export default function EditInfo() {
  const { id, itinerary, setItinerary, showCalendar, setShowCalendar } =
    useItinerary();
  const { updateItinerary } = apiRequests();
  const [edit, setEdit] = useState(false);
  const [updatedItinerary, setUpdatedItinerary] = useState(itinerary);

  const handleChange = (e) => {
    let { name, value, type } = e.target;

    type === "date" ? (value = `${value}T00:00:00`) : value;
    setUpdatedItinerary((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const cancelEdit = () => {
    setItinerary(itinerary);
    setEdit(false);
  };

  const handleSave = async () => {
    const res = await updateItinerary(id, updatedItinerary);
    const { response, data } = res;

    if (response.ok) {
      setItinerary(updatedItinerary);
      setEdit(false);
    } else {
      cancelEdit();
      alert("Failed to save info.");
    }
  };

  return (
    <>
      <div className="page-title items-center">
        {edit ? (
          <>
            <div className="w-full mr-2">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                value={updatedItinerary.title}
                className="basic-input w-full mr-2"
                onChange={handleChange}
              />
            </div>
            <div className="flex mt-4">
              <i
                className="fa-solid fa-xmark icon-button mr-1"
                onClick={cancelEdit}
              ></i>
              <i
                className="fa-solid fa-floppy-disk icon-button"
                onClick={handleSave}
              ></i>
            </div>
          </>
        ) : (
          <>
            <p className="text-lg">{itinerary.title}</p>
            <i
              className="fa-solid fa-pen-to-square icon-button"
              onClick={() => setEdit((prev) => !prev)}
            ></i>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center">
        {edit ? (
          <>
            {/* Start Date */}
            <div className="flex flex-col mr-2">
              <p>
                Start Date{" "}
                <span className="text-sm text-gray-500">(editing)</span>
              </p>
              <input
                type="date"
                name="startDate"
                value={removeTime(updatedItinerary.startDate)}
                onChange={handleChange}
                className="mb-2 size-fit bg-gray-300 p-2 rounded-md"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col">
              <p>
                End Date{" "}
                <span className="text-sm text-gray-500">(editing)</span>
              </p>
              <input
                type="date"
                name="endDate"
                value={removeTime(updatedItinerary.endDate)}
                onChange={handleChange}
                className="mb-2 size-fit bg-gray-300 p-2 rounded-md"
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col mr-2">
              <p>Start Date</p>
              <p className="mb-2 size-fit site-green text-white p-2 rounded-md">
                {formatDate(updatedItinerary.startDate)}{" "}
                <i className="fa-regular fa-calendar"></i>
              </p>
            </div>
            <div className="flex flex-col">
              <p>End Date</p>
              <p className="mb-2 size-fit site-green text-white p-2 rounded-md">
                {formatDate(updatedItinerary.endDate)}{" "}
                <i className="fa-regular fa-calendar"></i>
              </p>
            </div>
          </>
        )}

        <button
          className="site-green size-fit text-white flex items-center rounded-md p-2 mt-4 hover:site-yellow ml-2"
          onClick={() => setShowCalendar((prev) => !prev)}
        >
          {!showCalendar ? "Show Calendar" : "Show Map"}{" "}
          <i className="fa-solid fa-eye ml-2"></i>
        </button>
      </div>
    </>
  );
}
