import { useEffect, useState } from "react";
import Itineraries from "./Itineraries";
import EditInfo from "../sub-components/EditInfo";
import { usePage } from "../../../App";
import AddActivity from "../sub-components/AddActivity";

export default function Itinerary({ id }) {
  const { setPage } = usePage();
  const [itinerary, setItinerary] = useState({});
  const [loading, setLoading] = useState(true);
  const [addActivity, setAddActivity] = useState(false);

  const getItinerary = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/itineraries/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setItinerary(data);
        setLoading(false);
      } else {
        setPage(<Itineraries />);
        alert("No itinerary found");
      }
    } catch (error) {
      setPage(<Itineraries />);
      alert("Failed to retrieve itinerary");
    }
  };

  useEffect(() => {
    getItinerary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center page-layout">
        <i className="fas fa-circle-notch fa-spin text-5xl text-black"></i>
      </div>
    );
  }

  return (
    <>
      {itinerary && (
        <div className="page-layout flex flex-col">
          <EditInfo
            id={id}
            getItinerary={getItinerary}
            setItinerary={setItinerary}
            itinerary={itinerary}
          />
          <p>Activities</p>
          {/* Show calendar with activites on days */}
          {itinerary.activities &&
            itinerary.activities.map((item, idx) => (
              <div key={item._id}>
                <p className="py-2 border-b mb-2">Activity #{idx + 1}</p>
                <p>
                  {item.activity} @ {item.location.name}
                </p>
                <p>Time: {item.time}</p>
                {item.notes && <p>Notes: {item.notes}</p>}
                {item.completed === false ? <p>Incomplete</p> : <p>Complete</p>}
              </div>
            ))}
          {addActivity ? (
            <AddActivity
              id={id}
              setAddActivity={setAddActivity}
              getItinerary={getItinerary}
              setItinerary={setItinerary}
              itinerary={itinerary}
            />
          ) : (
            <button
              className="basic-button"
              onClick={() => setAddActivity((prev) => !prev)}
            >
              Add an activity
              <i className="fa-solid fa-plus ml-1"></i>
            </button>
          )}
        </div>
      )}
    </>
  );
}
