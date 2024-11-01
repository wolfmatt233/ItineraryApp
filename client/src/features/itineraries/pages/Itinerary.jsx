import { useEffect, useState } from "react";
import Itineraries from "./Itineraries";
import EditInfo from "../sub-components/EditInfo";
import { usePage } from "../../../App";

export default function Itinerary({ id }) {
  const { setPage } = usePage();
  const [itinerary, setItinerary] = useState({});

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
        </div>
      )}
    </>
  );
}
