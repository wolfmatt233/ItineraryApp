import { useState } from "react";
import { convertDate, removeTime } from "../../functions/formatDate";
import { clickMarker } from "../../functions/mapFunctions";
import { useActivity } from "./ActivityMap";

export default function ActivityList() {
  const {
    applyFilter,
    filterDate,
    setFilterDate,
    clearFilter,
    clusterGroupRef,
  } = useActivity();
  const filteredActivities = applyFilter();
  const [toggleLocations, setToggleLocations] = useState(true);
  let lastDate = null;

  const handleFilterClick = (activity) => {
    if (filterDate == "") {
      setFilterDate(activity.datetime.split("T")[0]);
    } else {
      clearFilter();
    }
  };

  return (
    <>
      {filteredActivities.length > 0 && (
        <div
          className={`${
            !toggleLocations ? "w-fit" : "w-[273px]"
          } absolute bg-white max-h-40 left-3 top-[10px] z-[1000] rounded-t-md`}
        >
          <p
            className={`p-1 ${
              toggleLocations ? "rounded-t-md" : "rounded-sm"
            } list-title`}
            onClick={() => setToggleLocations((prev) => !prev)}
          >
            Locations
            <i
              className={`fa-solid fa-caret-${
                toggleLocations ? "up mt-1" : "down"
              } ml-2 mr-1`}
            ></i>
          </p>

          {toggleLocations && (
            <div className="overflow-x-hidden flex flex-col bg-white max-h-[350px]">
              {filteredActivities.map((activity, idx) => {
                const currentDate = removeTime(activity.datetime);
                const showHeader = currentDate !== lastDate;
                lastDate = removeTime(currentDate);

                return (
                  <div key={idx} className="flex flex-col">
                    {showHeader && (
                      <button
                        className="bg-gray-200 p-2 font-bold text-left hover:bg-gray-300 flex items-center justify-between border-t border-gray-300"
                        onClick={() => handleFilterClick(activity)}
                      >
                        {convertDate(activity.datetime)}
                        <i className="fa-regular fa-calendar"></i>
                      </button>
                    )}

                    <button
                      className="hover:bg-gray-200 border-t border-gray-300 p-1 text-left"
                      onClick={() => {
                        clickMarker(clusterGroupRef, activity._id);
                      }}
                    >
                      ({idx + 1}) {activity.location.name}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}
