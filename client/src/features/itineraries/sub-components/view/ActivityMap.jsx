import { createContext, useContext, useEffect, useRef, useState } from "react";
import ActivitiesList from "./ActivityList";
import ActivitiesButtons from "./ActivityButtons";
import DeleteActivity from "../delete/DeleteActivity";
import { useItinerary } from "../../pages/Itinerary";
import ActivityMarkers from "./ActivityMarkers";
import { removeTime } from "../../functions/formatDate";

const ActivityContext = createContext();
export const useActivity = () => useContext(ActivityContext);

export default function ActivityMap({ setActivityId }) {
  const { itinerary } = useItinerary();
  const [activities, setActivities] = useState(
    itinerary.activities.sort(
      (a, b) => new Date(a.datetime) - new Date(b.datetime)
    )
  );
  const [scroll, setScroll] = useState(false);
  const [modal, setModal] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const clusterGroupRef = useRef();

  const clearFilter = () => {
    setFilterDate("");
    setActivities(itinerary.activities);
  };

  const applyFilter = () => {
    if (filterDate) {
      return activities.filter(
        (activity) => removeTime(activity.datetime) === filterDate
      );
    } else {
      return itinerary.activities.sort(
        (a, b) => new Date(a.datetime) - new Date(b.datetime)
      );
    }
  };

  const contextSharing = {
    applyFilter,
    filterDate,
    setFilterDate,
    clearFilter,
    scroll,
    setScroll,
    setModal,
    clusterGroupRef,
  };

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modal]);

  useEffect(() => {
    if (filterDate) {
      setActivities(
        activities.filter(
          (activity) => removeTime(activity.datetime) === filterDate
        )
      );
    } else {
      setActivities(
        itinerary.activities.sort(
          (a, b) => new Date(a.datetime) - new Date(b.datetime)
        )
      );
    }
  }, [filterDate]);

  return (
    <div className="-mx-4 sm:mx-0 relative">
      <ActivityContext.Provider value={contextSharing}>
        {modal && (
          <DeleteActivity modal={modal} setActivities={setActivities} />
        )}

        <ActivitiesButtons />

        <ActivitiesList />

        <ActivityMarkers
          setActivityId={setActivityId}
          activities={activities}
        />
      </ActivityContext.Provider>
    </div>
  );
}
