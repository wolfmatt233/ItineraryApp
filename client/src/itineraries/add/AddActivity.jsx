import { useEffect, useRef, useState } from "react";
import LocationSearch from "./LocationSearch";
import AddForm from "./AddForm";
import SelectMap from "./SelectMap";
import { useItinerary } from "../../pages/itinerary/Itinerary";

export default function AddActivity() {
  const { setShowMap } = useItinerary();
  const [markers, setMarkers] = useState([]);
  const [location, setLocation] = useState(false);
  const clusterGroupRef = useRef();

  useEffect(() => {
    if (!location) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [location]);

  return (
    <>
      {location ? (
        <AddForm setLocation={setLocation} location={location} />
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[2000] h-screen">
          <div className="h-screen">
            {/* Exit button */}
            <i
              className="fa-solid fa-circle-xmark exit-map-btn"
              onClick={() => setShowMap((prev) => !prev)}
            ></i>

            {/* Standard input search */}
            <LocationSearch
              setMarkers={setMarkers}
              clusterGroupRef={clusterGroupRef}
              setLocation={setLocation}
            />

            {/* Map with search markers */}
            <SelectMap
              markers={markers}
              setLocation={setLocation}
              clusterGroupRef={clusterGroupRef}
            />
          </div>
        </div>
      )}
    </>
  );
}
