import { createContext, useContext, useEffect, useState } from "react";
import Itineraries from "./Itineraries";
import EditInfo from "../sub-components/edit/EditInfo";
import { usePage } from "../../../App";
import AddActivity from "../sub-components/add/AddActivity";
import ActivityMap from "../sub-components/view/ActivityMap";
import { useAuth } from "../../../context/AuthContext";
import Calendar from "../sub-components/other/Calendar";
import EditActivity from "../sub-components/edit/EditActivity";

const ItineraryContext = createContext();
export const useItinerary = () => useContext(ItineraryContext);

export default function Itinerary({ id }) {
  const { setPage } = usePage();
  const { refreshLogin } = useAuth();
  const [itinerary, setItinerary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [activityId, setActivityId] = useState(false);

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
    if (!showMap) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showMap]);

  useEffect(() => {
    console.log(activityId, showMap);
  }, [activityId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center page-layout">
        <i className="fas fa-circle-notch fa-spin text-5xl text-black"></i>
      </div>
    );
  }

  return (
    <ItineraryContext.Provider
      value={{ id, itinerary, setItinerary, setShowMap }}
    >
      {itinerary && (
        <div className="page-layout flex flex-col">
          <EditInfo getItinerary={getItinerary} />

          {/* Show Activities Map, Select Location Map, Add Activity Form, or Edit Activity Form */}

          {showMap && !activityId ? (
            <ActivityMap setActivityId={setActivityId} />
          ) : !activityId && !showMap ? (
            <AddActivity />
          ) : activityId && !showMap ? (
            <EditActivity
              activityId={activityId}
              setActivityId={setActivityId}
            />
          ) : null}

          <Calendar itinerary={itinerary} />
        </div>
      )}
    </ItineraryContext.Provider>
  );
}

// {showMap && !location && !activityId ? (
//   <ActivityMap setActivityId={setActivityId} />
// ) : !location && !showMap ? (
//   <SelectMap setLocation={setLocation} />
// ) : !showMap && location ? (
//   <AddActivity setLocation={setLocation} location={location} />
// ) : activityId && showMap && !location ? (
//   <EditActivity
//     activityId={activityId}
//     setActivityId={setActivityId}
//   />
// ) : null}
