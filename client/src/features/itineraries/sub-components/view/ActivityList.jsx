import { useState } from "react";
import { convertDate, removeTime } from "../../functions/formatDate";
import { clickMarker } from "../../functions/mapFunctions";
import { useFilter } from "../ActivityMap";

export default function ActivityList({ clusterGroupRef }) {
  const { applyFilter, filterDate, setFilterDate, clearFilter } = useFilter();
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
          } absolute bg-white max-h-40 top-24 left-[10px] z-[1000]`}
        >
          <p
            className="p-1 rounded-t-md site-green text-white font-semibold cursor-pointer select-none"
            onClick={() => setToggleLocations((prev) => !prev)}
          >
            Locations
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
                        className="bg-gray-300 p-2 font-bold text-left"
                        onClick={() => handleFilterClick(activity)}
                      >
                        {convertDate(activity.datetime)}
                      </button>
                    )}

                    <button
                      className="hover:bg-gray-200 border-b p-1 text-left"
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
