import { useEffect, useState } from "react";
import { usePage } from "../../../App";
import Itinerary from "./Itinerary";

export default function CreateItinerary() {
  const { setPage } = usePage();
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

    try {
      const response = await fetch("http://localhost:5000/api/itineraries", {
        method: "POST",
        body: JSON.stringify(newItinerary),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 201) {
        setPage(<Itinerary id={data._id} />);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error uploading your itinerary");
    }
  };

  return (
    <form className="page-layout flex flex-col">
      <p className="text-lg py-2 border-b mb-5">Create Itinerary</p>
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
    </form>
  );
}
