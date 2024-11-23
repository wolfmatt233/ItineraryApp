import { useEffect, useState } from "react";
import { convertDate, getTime, removeTime } from "../functions/formatDate";

export default function Calendar({ itinerary }) {
  let lastDate = null;

  return (
    // TODO: Real calendar view
    <>
      {itinerary.activities &&
        itinerary.activities.map((activity, idx) => {
          const currentDate = removeTime(activity.datetime);
          const showHeader = currentDate !== lastDate;
          lastDate = removeTime(currentDate);

          return (
            <div key={activity._id} className="mt-4 p-2 border-x">
              {showHeader && (
                <div className="bg-gray-300 p-2 -mx-2 font-bold">
                  {convertDate(activity.datetime)}
                </div>
              )}
              <p className="py-2 border-b mb-2">Activity #{idx + 1}</p>
              <p>
                {activity.activity} @ {activity.location.name}
              </p>
              <p>
                {convertDate(activity.datetime)} @ {getTime(activity.datetime)}
              </p>
              {activity.notes && <p>Notes: {activity.notes}</p>}
              {activity.completed === false ? (
                <p>Status: Incomplete</p>
              ) : (
                <p>Status: Complete</p>
              )}
            </div>
          );
        })}
    </>
  );
}
