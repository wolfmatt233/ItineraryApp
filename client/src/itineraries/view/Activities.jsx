import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ActivityMap from "./ActivityMap";
import ActivityList from "./ActivityList";
import MapButtons from "./MapButtons";
import DeleteActivity from "../delete/DeleteActivity";
import { useItinerary } from "../../pages/itinerary/Itinerary";
import { sortDates } from "../functions/mapFunctions";

const ActivityContext = createContext();
export const useActivity = () => useContext(ActivityContext);

export default function Activities() {
  const { itinerary } = useItinerary();
  const [filterDate, setFilterDate] = useState("");
  const [scroll, setScroll] = useState(false);
  const [modal, setModal] = useState(false);
  const clusterGroupRef = useRef();

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

  const filteredActivities = useMemo(() => {
    let sortedDates = sortDates(itinerary.activities);

    if (!filterDate) return sortedDates;

    return sortedDates.filter(
      (activity) => activity.date.split("T")[0] === filterDate
    );
  }, [filterDate, itinerary.activities]);

  const contextSharing = {
    filterDate,
    setFilterDate,
    scroll,
    setScroll,
    setModal,
    clusterGroupRef,
  };

  return (
    <div className="relative">
      <ActivityContext.Provider value={contextSharing}>
        {modal && <DeleteActivity modal={modal} />}

        <MapButtons />

        <ActivityList activities={filteredActivities} />

        <ActivityMap
          key={filteredActivities.length}
          activities={filteredActivities}
        />
      </ActivityContext.Provider>
    </div>
  );
}
