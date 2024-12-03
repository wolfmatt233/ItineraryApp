import { useEffect, useState } from "react";
import { usePage } from "../../App";
import { formatDate } from "../../itineraries/functions/formatDate";
import DeleteItinerary from "../../itineraries/delete/DeleteItinerary";
import { apiRequests } from "../../requests/apiRequests";
import Loading from "../../layouts/Loading";

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

  if (loading) return <Loading />;

  return (
    <div className="page-layout relative">
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
        <div key={idx} className="flex border-b">
          <button
            className="list-button"
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
              className="fa-solid fa-trash delete-button"
              id={item._id}
              onClick={() => setModal(item._id)}
            ></i>
          )}
          {modal === item._id && (
            <DeleteItinerary
              id={item._id}
              name={item.title}
              setModal={setModal}
              setItineraries={setItineraries}
            />
          )}
        </div>
      ))}
    </div>
  );
}
