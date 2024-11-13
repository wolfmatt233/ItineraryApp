import { useEffect, useState } from "react";
import Itineraries from "./Itineraries";
import EditInfo from "../sub-components/edit/EditInfo";
import { usePage } from "../../../App";
import AddActivity from "../sub-components/add/AddActivity";
import ActivitiesMap from "../sub-components/ActivitiesMap";
import SelectMap from "../sub-components/add/SelectMap";
import { useAuth } from "../../../context/AuthContext";
import DeleteActivity from "../sub-components/delete/DeleteActivity";
import Calendar from "../sub-components/Calendar";

export default function Itinerary({ id }) {
  const { setPage } = usePage();
  const { refreshLogin } = useAuth();
  const [itinerary, setItinerary] = useState({});
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(false);
  const [showMap, setShowMap] = useState(true);
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
    if ((!showMap && location) || (!showMap && !location) || modal) {
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

          {showMap ? (
            // Automatically shown via showMap
            <ActivitiesMap
              itinerary={itinerary}
              setShowMap={setShowMap}
              setModal={setModal}
            />
          ) : !location ? (
            // Shown when showMap is false & no selected location
            <SelectMap
              setLocation={setLocation}
              itinerary={itinerary}
              setShowMap={setShowMap}
            />
          ) : (
            // Shown when no map & a selected location
            <AddActivity
              id={id}
              setLocation={setLocation}
              location={location}
              setItinerary={setItinerary}
              itinerary={itinerary}
              setShowMap={setShowMap}
            />
          )}

          <Calendar itinerary={itinerary} />
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
