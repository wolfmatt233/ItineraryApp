import { useRef } from "react";
import { useItinerary } from "../../pages/itinerary/Itinerary";
import { useActivity } from "./Activities";
import { removeTime } from "../functions/formatDate";

export default function MapButtons() {
  const { itinerary, setShowMap, setShowCalendar } = useItinerary();
  const { filterDate, setFilterDate, scroll, setScroll } = useActivity();
  const dateInputRef = useRef(null);

  return (
    <div className="absolute top-3 right-3 z-[1000] max-sm:right-6 flex flex-col items-end">
      {/* Add location */}
      <i
        className="fa-solid fa-square-plus map-btn mb-2"
        title="Add Location"
        onClick={() => setShowMap((prev) => !prev)}
      ></i>

      <div className="flex items-end mb-2">
        {/* Clear filter */}
        {filterDate && (
          <i
            className="fa-solid fa-calendar-xmark map-btn mr-2"
            title="Clear Filter"
            onClick={() => setFilterDate("")}
          ></i>
        )}

        {/* Filter by date */}
        <div
          className="map-btn"
          title="Date Filter"
          onClick={() => {
            if (dateInputRef.current) {
              dateInputRef.current.showPicker();
            }
          }}
        >
          <i className="fa-solid fa-calendar-days"></i>
          <input
            ref={dateInputRef}
            type="date"
            className="w-0"
            min={removeTime(itinerary.startDate)}
            max={removeTime(itinerary.endDate)}
            name="filterDate"
            onChange={(e) => {
              setFilterDate(e.target.value);
            }}
            value={filterDate}
          />
        </div>
      </div>

      {/* View Calendar */}
      <i
        className="fa-regular fa-calendar map-btn mb-2"
        title="View Calendar"
        onClick={() => setShowCalendar((prev) => !prev)}
      ></i>

      {/* Toggle scroll */}
      <i
        className={`fa-solid fa-computer-mouse ${scroll && "text-blue-500"} map-btn`}
        title="Scroll Toggle"
        onClick={() => setScroll((prev) => !prev)}
      ></i>
    </div>
  );
}
