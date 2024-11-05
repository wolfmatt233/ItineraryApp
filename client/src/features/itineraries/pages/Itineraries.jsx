import { useEffect, useState } from "react";
import { usePage } from "../../../App";
import Itinerary from "./Itinerary";
import { formatDate } from "../functions/formatDate";
import Error from "../../Error";
import DeleteModal from "../sub-components/DeleteModal";
import { useAuth } from "../../../context/AuthContext";

export default function Itineraries() {
  const { setPage } = usePage();
  const { refreshLogin } = useAuth();
  const [itineraries, setItineraries] = useState([]);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(false);
  const [modal, setModal] = useState(false);

  const getItineraries = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/itineraries", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await response.json();

      if (response.status === 403) {
        refreshLogin();
      } else if (!data.items) {
        setError(data.message);
      } else {
        setItineraries(data.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getItineraries();
  }, []);

  return (
    <div className="page-layout relative">
      {error ? (
        <Error message={error} />
      ) : (
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
            <div
              key={idx}
              className="flex max-sm:-mx-4 max-sm:w-screen border-b"
            >
              <button
                className="bg-[#4ABDAC] text-white px-2 flex w-full items-center justify-between hover:bg-[#f7b733]"
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
              {edit && (
                <i
                  className="fa-solid fa-trash text-xl h-[45px] flex items-center justify-center w-11 bg-[#fc4a1a] hover:bg-[#fc1a1a] text-white cursor-pointer"
                  id={item._id}
                  onClick={() => setModal(item._id)}
                ></i>
              )}
              {modal == item._id && (
                <DeleteModal
                  id={item._id}
                  setModal={setModal}
                  setItineraries={setItineraries}
                />
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
