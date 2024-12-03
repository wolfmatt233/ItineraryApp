import { createContext, useContext, useEffect, useState } from "react";
import EditInfo from "../../itineraries/edit/EditInfo";
import AddActivity from "../../itineraries/add/AddActivity";
import ActivityCalendar from "../../itineraries/view/ActivityCalendar";
import EditActivity from "../../itineraries/edit/EditActivity";
import { apiRequests } from "../../requests/apiRequests";
import { usePage } from "../../App";
import Activities from "../../itineraries/view/Activities";
import Loading from "../../layouts/Loading";

const ItineraryContext = createContext();
export const useItinerary = () => useContext(ItineraryContext);

export default function Itinerary({ id }) {
  const { setPage } = usePage();
  const { fetchItinerary, fetchActivities } = apiRequests();
  const [itinerary, setItinerary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activityId, setActivityId] = useState(false);

  const getItinerary = async () => {
    const res = await fetchItinerary(id);
    const { response, data } = res;
    const res2 = await fetchActivities(id);

    const combinedItinerary = {
      ...data,
      activities: res2.data,
    };

    if (response.ok) {
      setItinerary(combinedItinerary);
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
    if (activityId || showMap) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [activityId, showMap]);

  useEffect(() => {
    setActivityId(false);
    setShowMap(false);
  }, [showCalendar]);

  const contextSharing = {
    id,
    itinerary,
    setItinerary,
    setShowMap,
    showCalendar,
    setShowCalendar,
    setActivityId,
  };

  if (loading) return <Loading />;

  return (
    <ItineraryContext.Provider value={contextSharing}>
      {itinerary && (
        <div className="page-layout flex flex-col">
          <EditInfo />

          {showCalendar ? (
            <ActivityCalendar itinerary={itinerary} />
          ) : (
            <Activities />
          )}

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
