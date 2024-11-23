import { useState } from "react";
import { convertDate } from "../functions/formatDate";
import { clickMarker } from "../functions/mapFunctions";
import { useActivity } from "./Activities";

export default function ActivityList({ activities }) {
  const { filterDate, setFilterDate, clusterGroupRef } = useActivity();
  const [toggleLocations, setToggleLocations] = useState(true);
  let lastDate = null;

  const handleFilterClick = (date) => {
    if (filterDate === "") {
      setFilterDate(date.split("T")[0]);
    } else {
      setFilterDate("");
    }
  };

  return (
    <>
      {activities.length > 0 && (
        <div
          className={`w-[273px] absolute bg-white max-h-[480px] left-3 top-[10px] z-[1000] rounded-md`}
        >
          <p
            className={`p-1 ${
              toggleLocations ? "rounded-t-md" : "rounded-md"
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
              {activities.map((activity, idx) => {
                const currentDate = activity.date.split(" ")[0];
                const showHeader = currentDate !== lastDate;
                lastDate = currentDate;

                return (
                  <div key={idx} className="flex flex-col">
                    {showHeader && (
                      <button
                        className="bg-gray-200 p-2 font-bold text-left hover:bg-gray-300 flex items-center justify-between border-t border-gray-300"
                        onClick={() => handleFilterClick(activity.date)}
                      >
                        {convertDate(activity.date)}
                        <i className="fa-regular fa-calendar"></i>
                      </button>
                    )}

                    <button
                      className="hover:bg-gray-200 border-t border-gray-300 p-1 text-left"
                      onClick={() => {
                        clickMarker(clusterGroupRef, activity._id);
                      }}
                    >
                      ({idx + 1}) {activity.locationName}
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
