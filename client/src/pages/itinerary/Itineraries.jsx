import { useEffect, useState } from "react";
import { usePage } from "../../App";
import { formatDate } from "../../itineraries/functions/formatDate";
import Error from "../Error";
import DeleteItinerary from "../../itineraries/delete/DeleteItinerary";
import { apiRequests } from "../../requests/apiRequests";

export default function Itineraries() {
  const { setPage } = usePage();
  const { fetchItineraries } = apiRequests();
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [modal, setModal] = useState(false);

  const getItineraries = async () => {
    const res = await fetchItineraries();
    const { response, data } = res;

    if (!data.items) {
      setPage(`error:${data.message}`);
    } else {
      setItineraries(data.items);
    }

    setLoading(false);
  };

  useEffect(() => {
    getItineraries();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <i className="fas fa-circle-notch fa-spin text-5xl text-black"></i>
      </div>
    );
  }

  return (
    <div className="page-layout relative">
      <>
        <div className="page-title">
          <p className="text-lg">Your Itineraries</p>
          <i
            className={`fa-solid fa-${
              edit ? "xmark" : "pen-to-square"
            } icon-button`}
            onClick={() => setEdit((prev) => !prev)}
          ></i>
        </div>
        {itineraries.map((item, idx) => (
          <div key={idx} className="flex max-sm:-mx-4 max-sm:w-screen border-b">
            <button
              className="bg-[#4ABDAC] text-white px-2 flex w-full items-center justify-between hover:bg-[#f7b733]"
              onClick={() => setPage(`itinerary:${item._id}`)}
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
            {edit && (
              <i
                className="fa-solid fa-trash text-xl h-[45px] flex items-center justify-center w-11 bg-[#fc4a1a] hover:bg-[#fc1a1a] text-white cursor-pointer"
                id={item._id}
                onClick={() => setModal(item._id)}
              ></i>
            )}
            {modal == item._id && (
              <DeleteItinerary
                id={item._id}
                name={item.title}
                setModal={setModal}
                setItineraries={setItineraries}
              />
            )}
          </div>
        ))}
      </>
    </div>
  );
}
