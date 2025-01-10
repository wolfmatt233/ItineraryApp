import { useState } from "react";
import { removeTime } from "../functions/formatDate";
import { itineraryRequests } from "../../requests/itineraryRequests";
import { useItinerary } from "../../pages/itinerary/Itinerary";

export default function EditInfo() {
  const { id, itinerary, setItinerary, showCalendar, setShowCalendar } =
    useItinerary();
  const { updateItinerary } = itineraryRequests();
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
    let sentItinerary = { ...updatedItinerary };
    delete sentItinerary.activities;

    const res = await updateItinerary(id, sentItinerary);
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
        <div className="w-full mr-2">
          {edit && <label htmlFor="title">Title</label>}
          <input
            disabled={edit ? false : true}
            type="text"
            name="title"
            value={updatedItinerary.title}
            className={
              edit ? "basic-input w-full" : "text-lg bg-transparent w-full"
            }
            onChange={handleChange}
          />
        </div>
        <div className="flex">
          {edit ? (
            <>
              <i
                className="fa-solid fa-xmark icon-button mr-1 mt-4"
                onClick={cancelEdit}
              ></i>
              <i
                className="fa-solid fa-floppy-disk icon-button mt-4"
                onClick={handleSave}
              ></i>
            </>
          ) : (
            <i
              className="fa-solid fa-pen-to-square icon-button"
              onClick={() => setEdit((prev) => !prev)}
            ></i>
          )}
        </div>
      </div>

      <div className="flex items-center max-sm:px-2 mb-4">
        {/* Start Date */}
        <div className="flex flex-col mr-2">
          <p>
            Start Date{" "}
            {edit && <span className="text-sm text-gray-500">(editing)</span>}
          </p>
          <div className="flex site-green text-white rounded-md p-2 size-fit items-center justify-center">
            <input
              disabled={edit ? false : true}
              type="date"
              name="startDate"
              value={removeTime(updatedItinerary.startDate)}
              onChange={handleChange}
              className="site-green"
            />
            {!edit && <i className="fa-regular fa-calendar ml-1"></i>}
          </div>
        </div>

        {/* End Date */}
        <div className="flex flex-col mr-2">
          <p>
            End Date{" "}
            {edit && <span className="text-sm text-gray-500">(editing)</span>}
          </p>
          <div className="flex site-green text-white rounded-md p-2 size-fit items-center justify-center">
            <input
              disabled={edit ? false : true}
              type="date"
              name="endDate"
              value={removeTime(updatedItinerary.endDate)}
              onChange={handleChange}
              className="site-green"
            />
            {!edit && <i className="fa-regular fa-calendar ml-1"></i>}
          </div>
        </div>

        {showCalendar && (
          <button
            className="site-green size-fit text-white flex items-center rounded-md mt-6 px-3 h-[40px] hover:site-yellow"
            onClick={() => setShowCalendar((prev) => !prev)}
          >
            <i className="fa-solid fa-map-location"></i>
          </button>
        )}
      </div>
    </>
  );
}
