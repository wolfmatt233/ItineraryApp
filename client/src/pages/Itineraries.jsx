import { useEffect, useState } from "react";
import { usePage } from "../App";
import Itinerary from "./Itinerary";
import { formatDate } from "../features/itineraries/functions/formatDate";
import Error from "./Error";

export default function Itineraries() {
  const { setPage } = usePage();
  const [itineraries, setItineraries] = useState([]);
  const [error, setError] = useState("");

  const getItineraries = async () => {
    const response = await fetch("http://localhost:5000/api/itineraries", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const data = await response.json();

    if (!data.items) {
      setError(data.message);
    } else {
      setItineraries(data.items);
    }
  };

  useEffect(() => {
    getItineraries();
  }, []);

  return (
    <div className="page-layout">
      {error ? (
        <Error message={error} />
      ) : (
        <>
          <p className="text-lg py-2 border-b mb-5">Your Itineraries</p>
          {itineraries.map((item, idx) => (
            <button
              key={idx}
              className="bg-[#4ABDAC] text-white px-2 flex w-full items-center justify-between hover:bg-[#f7b733] -mx-2 max-[1152px]:w-screen"
              onClick={() => setPage(<Itinerary id={item._id} />)}
            >
              <div className="flex items-center">
                <i className="fa-solid fa-location-dot mr-2"></i>
                <p className="text-lg py-2">{item.title}</p>
              </div>

              <div className="flex">
                <p>{formatDate(item.startDate)}</p>
                <p className="mx-1">-</p>
                <p>{formatDate(item.endDate)}</p>
              </div>
            </button>
          ))}
        </>
      )}
    </div>
  );
}
