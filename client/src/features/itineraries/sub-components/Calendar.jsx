import { useEffect, useState } from "react";
import { convertDate } from "../functions/formatDate";

export default function Calendar({ itinerary }) {
  return (
    // TODO: Real calendar view
    <>
      {itinerary.activities &&
        itinerary.activities.map((item, idx) => (
          <div key={item._id}>
            <p className="py-2 border-b mb-2">Activity #{idx + 1}</p>
            <p>
              {item.activity} @ {item.location.name}
            </p>
            <p>
              {convertDate(item.date)} @ {item.time}
            </p>
            {item.notes && <p>Notes: {item.notes}</p>}
            {item.completed === false ? (
              <p>Status: Incomplete</p>
            ) : (
              <p>Status: Complete</p>
            )}
          </div>
        ))}
    </>
  );
}
