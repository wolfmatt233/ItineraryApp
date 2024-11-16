import { createContext, useContext, useEffect, useState } from "react";
import Itineraries from "./Itineraries";
import EditInfo from "../sub-components/edit/EditInfo";
import { usePage } from "../../../App";
import AddActivity from "../sub-components/add/AddActivity";
import ActivityMap from "../sub-components/view/ActivityMap";
import Calendar from "../sub-components/view/Calendar";
import EditActivity from "../sub-components/edit/EditActivity";
import { apiRequests } from "../functions/apiRequests";
import { useAuth } from "../../../context/AuthContext";
import Loading from "../../../layouts/Loading";

const ItineraryContext = createContext();
export const useItinerary = () => useContext(ItineraryContext);

export default function Itinerary({ id }) {
  const { setPage } = usePage();
  const { fetchItinerary } = apiRequests();
  const [itinerary, setItinerary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activityId, setActivityId] = useState(false);

  const getItinerary = async () => {
    const res = await fetchItinerary(id);
    const { response, data } = res;

    if (response.ok) {
      setItinerary(data);
      setLoading(false);
    } else {
      setPage(<Itineraries />);
      alert("Couldn't find that itinerary.");
    }
  };

  useEffect(() => {
    getItinerary();
  }, []);

  useEffect(() => {
    let overflow = document.body.style.overflow;

    if (activityId) overflow = "auto";

    if (!showMap) {
      overflow = "hidden";
    } else {
      overflow = "auto";
    }
  }, [showMap]);

  useEffect(() => {
    setActivityId(false);
    setShowMap(true);
  }, [showCalendar]);

  if (loading) return <Loading />;

  return (
    <ItineraryContext.Provider
      value={{
        id,
        itinerary,
        setItinerary,
        setShowMap,
        showCalendar,
        setShowCalendar,
      }}
    >
      {itinerary && (
        <div className="page-layout flex flex-col">
          <EditInfo />

          {/* Map, form, and calendar display */}

          {!showCalendar ? (
            showMap && !activityId ? (
              <ActivityMap setActivityId={setActivityId} />
            ) : !activityId && !showMap ? (
              <AddActivity />
            ) : activityId && !showMap ? (
              <EditActivity
                activityId={activityId}
                setActivityId={setActivityId}
              />
            ) : null
          ) : (
            <Calendar itinerary={itinerary} />
          )}
        </div>
      )}
    </ItineraryContext.Provider>
  );
}
