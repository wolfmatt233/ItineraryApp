import { createContext, useContext, useEffect, useState } from "react";
import EditInfo from "../../itineraries/edit/EditInfo";
import AddActivity from "../../itineraries/add/AddActivity";
import ActivityCalendar from "../../itineraries/view/ActivityCalendar";
import EditActivity from "../../itineraries/edit/EditActivity";
import { itineraryRequests } from "../../requests/itineraryRequests";
import { activityRequests } from "../../requests/activityRequests";
import { usePage } from "../../App";
import Activities from "../../itineraries/view/Activities";
import Loading from "../../layouts/Loading";

const ItineraryContext = createContext();
export const useItinerary = () => useContext(ItineraryContext);

export default function Itinerary({ id }) {
  const { setPage } = usePage();
  const { fetchItinerary } = itineraryRequests();
  const { fetchActivities } = activityRequests();
  const [itinerary, setItinerary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activityId, setActivityId] = useState(false);

  const getItinerary = async () => {
    const itinRes = await fetchItinerary(id);
    const actRes = await fetchActivities(id);

    const combinedItinerary = {
      ...itinRes.data,
      activities: actRes.data,
    };

    if (itinRes.response.ok && actRes.response.ok) {
      setItinerary(combinedItinerary);
      setLoading(false);
    } else {
      const status = itinRes.response.status || actRes.response.status;
      const error = itinRes.data.error || actRes.data.error;
      setPage("itineraries");
      alert(`Error ${status}: ${error}`);
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
            <ActivityCalendar
              itinerary={itinerary}
              setActivityId={setActivityId}
            />
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
