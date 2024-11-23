import { createContext, useContext, useEffect, useState } from "react";
import EditInfo from "../../itineraries/edit/EditInfo";
import AddActivity from "../../itineraries/add/AddActivity";
import Calendar from "../../itineraries/view/Calendar";
import EditActivity from "../../itineraries/edit/EditActivity";
import { apiRequests } from "../../requests/apiRequests";
import { usePage } from "../../App";
import Activities from "../../itineraries/view/Activities";

const ItineraryContext = createContext();
export const useItinerary = () => useContext(ItineraryContext);

export default function Itinerary({ id }) {
  const { setPage } = usePage();
  const { fetchItinerary } = apiRequests();
  const [itinerary, setItinerary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activityId, setActivityId] = useState(false);

  const getItinerary = async () => {
    const res = await fetchItinerary(id);
    const { response, data } = res;

    if (response.ok) {
      setItinerary(data);
      setLoading(false);
    } else {
      setPage("itineraries");
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
    setShowMap(false);
  }, [showCalendar]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <i className="fas fa-circle-notch fa-spin text-5xl text-black"></i>
      </div>
    );
  }

  return (
    <ItineraryContext.Provider
      value={{
        id,
        itinerary,
        setItinerary,
        setShowMap,
        showCalendar,
        setShowCalendar,
        setActivityId,
      }}
    >
      {itinerary && (
        <div className="page-layout flex flex-col">
          <EditInfo />

          {showCalendar ? <Calendar itinerary={itinerary} /> : <Activities />}

          {activityId && (
            <EditActivity
              activityId={activityId}
              setActivityId={setActivityId}
            />
          )}

          {showMap && <AddActivity />}
        </div>
      )}
    </ItineraryContext.Provider>
  );
}
