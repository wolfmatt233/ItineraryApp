import { useState } from "react";
import { usePage } from "../../App";
import { itineraryRequests } from "../../requests/itineraryRequests";

export default function CreateItinerary() {
  const { setPage } = usePage();
  const { createItinerary } = itineraryRequests();
  const [newItinerary, setNewItinerary] = useState({
    title: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    setNewItinerary((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const res = await createItinerary(newItinerary);
    const { response, data } = res;

    if (response.ok) {
      setPage(`itinerary:${data._id}`);
    }
  };

  return (
    <form className="page-layout">
      <title>Create Itinerary</title>
      <p className="page-title">Create Itinerary</p>
      <div className="max-sm:px-2 flex flex-col">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          className="basic-input"
          onChange={handleChange}
        />
        <label htmlFor="startDate">Start Date</label>
        <input
          type="date"
          name="startDate"
          className="basic-input"
          onChange={handleChange}
        />
        <label htmlFor="endDate">End Date</label>
        <input
          type="date"
          name="endDate"
          className="basic-input"
          onChange={handleChange}
        />
        <button type="submit" className="basic-button" onClick={handleCreate}>
          Create Itinerary
        </button>
      </div>
    </form>
  );
}
