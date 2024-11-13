import { useState } from "react";
import { convertDate, removeTime } from "../../functions/formatDate";
import { clickMarker } from "../../functions/mapFunctions";

export default function ActivitiesList({ activities, clusterGroupRef }) {
  const [toggleLocations, setToggleLocations] = useState(true);
  let lastDate = null;

  return (
    <>
      {activities.length > 0 && (
        <div
          className={`${
            !toggleLocations ? "w-fit" : "w-[273px]"
          } absolute border bg-white max-h-40 top-24 left-[10px] z-[1000]`}
        >
          <p
            className="p-1 site-green text-white font-semibold cursor-pointer select-none"
            onClick={() => setToggleLocations((prev) => !prev)}
          >
            Locations
          </p>
          
          {toggleLocations && (
            <div className="overflow-x-hidden flex flex-col bg-white max-h-[350px]">
              {activities.map((activity, idx) => {
                const currentDate = removeTime(activity.date);
                const showHeader = currentDate !== lastDate;
                lastDate = removeTime(currentDate);

                return (
                  <div key={idx} className="flex flex-col">
                    {showHeader && (
                      <div className="bg-gray-300 p-2 font-bold">
                        {convertDate(currentDate)}
                      </div>
                    )}
                    <button
                      className="hover:bg-gray-200 border-b p-1 text-left"
                      onClick={() => {
                        clickMarker(
                          activity.location.coordinates.lat,
                          activity.location.coordinates.lon,
                          clusterGroupRef
                        );
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
