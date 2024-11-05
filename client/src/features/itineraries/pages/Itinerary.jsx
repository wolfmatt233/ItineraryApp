import { useEffect, useState } from "react";
import Itineraries from "./Itineraries";
import EditInfo from "../sub-components/EditInfo";
import { usePage } from "../../../App";
import AddActivity from "../sub-components/AddActivity";
import ActivitiesMap from "../sub-components/ActivitiesMap";
import SelectMap from "../sub-components/SelectMap";
import { convertDate } from "../functions/formatDate";
import { useAuth } from "../../../context/AuthContext";
import DeleteActivity from "../sub-components/DeleteActivity";

export default function Itinerary({ id }) {
  const { setPage } = usePage();
  const { refreshLogin } = useAuth();
  const [itinerary, setItinerary] = useState({});
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [modal, setModal] = useState(false);

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

      if (response.ok) {
        setItinerary(data);
        setLoading(false);
      } else if (response.status === 404) {
        setPage(<Itineraries />);
        console.log("No itinerary found");
      } else {
        refreshLogin();
        getItinerary();
      }
    } catch (error) {
      setPage(<Itineraries />);
      alert("Failed to retrieve itinerary");
    }
  };

  useEffect(() => {
    getItinerary();
  }, []);

  useEffect(() => {
    if ((!showMap && location) || modal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMap, modal]);

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
          {!location && (
            <button
              className="basic-button"
              onClick={() => setShowMap((prev) => !prev)}
            >
              {showMap ? "Add an Activity/Location" : "Cancel"}
            </button>
          )}

          {showMap ? (
            <ActivitiesMap itinerary={itinerary} setModal={setModal} />
          ) : !location ? (
            <SelectMap
              setLocation={setLocation}
              itinerary={itinerary}
              setShowMap={setShowMap}
            />
          ) : (
            <AddActivity
              id={id}
              setLocation={setLocation}
              location={location}
              setItinerary={setItinerary}
              itinerary={itinerary}
              setShowMap={setShowMap}
            />
          )}

          {/* TODO: Show calendar with activites on days */}

          {itinerary.activities &&
            itinerary.activities.map((item, idx) => (
              <div key={item._id}>
                <p className="py-2 border-b mb-2">Activity #{idx + 1}</p>
                <p>
                  {item.activity} @ {item.location.name}
                </p>
                <p>
                  {" "}
                  {convertDate(item.date)} @ {item.time}
                </p>
                {item.notes && <p>Notes: {item.notes}</p>}
                {item.completed === false ? <p>Incomplete</p> : <p>Complete</p>}
              </div>
            ))}
        </div>
      )}
      {modal && (
        <DeleteActivity
          modal={modal}
          setModal={setModal}
          setItinerary={setItinerary}
          itinerary={itinerary}
        />
      )}
    </>
  );
}
