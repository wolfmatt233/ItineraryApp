import { useEffect, useState } from "react";
import { convertDate, getTime, removeTime } from "../functions/formatDate";

export default function Calendar({ itinerary }) {
  let lastDate = null;

  return (
    // TODO: Real calendar view
    <>
      {itinerary.activities &&
        itinerary.activities.map((activity, idx) => {
          const currentDate = activity.date.split("T")[0];
          const showHeader = currentDate !== lastDate;
          lastDate = currentDate.split("T")[0];

          return (
            <div key={activity._id} className="mt-4 p-2 border-x">
              {showHeader && (
                <div className="bg-gray-300 p-2 -mx-2 font-bold">
                  {convertDate(activity.date)}
                </div>
              )}
              <p className="py-2 border-b mb-2">Activity #{idx + 1}</p>
              <p>
                {activity.activity} @ {activity.locationName}
              </p>
              <p>
                {convertDate(activity.date)} @ {getTime(activity.date)}
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
