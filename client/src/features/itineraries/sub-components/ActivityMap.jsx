import { createContext, useContext, useEffect, useRef, useState } from "react";
import ActivitiesList from "./view/ActivityList";
import ActivitiesButtons from "./view/ActivityButtons";
import DeleteActivity from "./delete/DeleteActivity";
import { useItinerary } from "../pages/Itinerary";
import ActivityMarkers from "./view/ActivityMarkers";
import { removeTime } from "../functions/formatDate";

const FilterContext = createContext();
export const useFilter = () => useContext(FilterContext);

export default function ActivityMap({ setActivityId }) {
  const { itinerary } = useItinerary();
  const [activities, setActivities] = useState(
    itinerary.activities.sort(
      (a, b) => new Date(a.datetime) - new Date(b.datetime)
    )
  );
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
      {modal && (
        <DeleteActivity
          modal={modal}
          setModal={setModal}
          setActivities={setActivities}
        />
      )}
      <FilterContext.Provider
        value={{ applyFilter, filterDate, setFilterDate, clearFilter }}
      >
        <ActivitiesButtons setActivities={setActivities} />

        <ActivitiesList
          activities={activities}
          setActivities={setActivities}
          clusterGroupRef={clusterGroupRef}
        />

        <ActivityMarkers
          setModal={setModal}
          setActivityId={setActivityId}
          activities={activities}
          clusterGroupRef={clusterGroupRef}
        />
      </FilterContext.Provider>
    </div>
  );
}
