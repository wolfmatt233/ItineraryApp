import { useEffect, useState } from "react";

export default function EditInfo({
  itinerary,
  getItinerary,
  setItinerary,
  id,
}) {
  const [edit, setEdit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItinerary((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const cancelEdit = () => {
    getItinerary();
    setEdit(false);
  };

  const saveInfo = async () => {
    try {
      const save = await fetch(`http://localhost:5000/api/itineraries/${id}`, {
        method: "PATCH",
        body: JSON.stringify(itinerary),
      });

      const data = save.json();

      if (save.status != 200) {
        setEdit(false);
        alert(data.message);
      } else {
        
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="py-2 border-b mb-3 flex justify-between items-center">
        {edit ? (
          <>
            <input
              type="text"
              name="title"
              value={itinerary.title}
              className="text-lg w-full mr-2"
              onChange={handleChange}
            />
            <i
              className="fa-solid fa-xmark cursor-pointer text-lg"
              onClick={cancelEdit}
            ></i>
            <i
              class="fa-solid fa-floppy-disk cursor-pointer text-lg"
              onClick={saveInfo}
            ></i>
          </>
        ) : (
          <>
            <p className="text-lg">{itinerary.title}</p>
            <i
              className="fa-solid fa-pen-to-square cursor-pointer text-lg"
              onClick={() => setEdit((prev) => !prev)}
            ></i>
          </>
        )}
      </div>
      <div className="flex flex-wrap">
        <div className="flex flex-col mr-2">
          <div className="flex flex-col">
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
      </div>
    </>
  );
}
