import { useEffect, useState } from "react";
import { formatDate, removeTime } from "../../functions/formatDate";

export default function EditInfo({
  itinerary,
  getItinerary,
  setItinerary,
  id,
}) {
  const [edit, setEdit] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;

    setItinerary((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const cancelEdit = () => {
    getItinerary();
    setEdit(false);
  };

  const handleSave = async () => {
    try {
      const save = await fetch(`http://localhost:5000/api/itineraries/${id}`, {
        method: "PATCH",
        body: JSON.stringify(itinerary),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await save.json();

      if (save.status === 200) {
        setEdit(false);
      } else {
        cancelEdit();
        alert(data.message);
      }
    } catch (error) {
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
                value={itinerary.title}
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
      <div className="flex flex-wrap">
        <div className="flex flex-col mr-2 mb-2">
          <p>
            Start Date{" "}
            {edit && <span className="text-sm text-gray-500">(editing)</span>}
          </p>
          {edit ? (
            <input
              type="date"
              name="startDate"
              value={removeTime(itinerary.startDate)}
              onChange={handleChange}
              className="mb-2 size-fit bg-gray-300 p-2 rounded-md"
            />
          ) : (
            <p className="mb-2 size-fit bg-[#4ABDAC] text-white p-2 rounded-md">
              {formatDate(itinerary.startDate)}{" "}
              <i className="fa-regular fa-calendar"></i>
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <p>
            End Date{" "}
            {edit && <span className="text-sm text-gray-500">(editing)</span>}
          </p>
          {edit ? (
            <input
              type="date"
              name="endDate"
              value={removeTime(itinerary.endDate)}
              onChange={handleChange}
              className="mb-2 size-fit bg-gray-300 p-2 rounded-md"
            />
          ) : (
            <p className="mb-2 size-fit bg-[#4ABDAC] text-white p-2 rounded-md">
              {formatDate(itinerary.endDate)}{" "}
              <i className="fa-regular fa-calendar"></i>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
