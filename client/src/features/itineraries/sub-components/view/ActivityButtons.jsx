import { useEffect, useState, useRef } from "react";
import { removeTime } from "../../functions/formatDate";
import { useItinerary } from "../../pages/Itinerary";
import { useActivity } from "./ActivityMap";

export default function ActivityButtons() {
  const { itinerary, setShowMap } = useItinerary();
  const { filterDate, setFilterDate, clearFilter, scroll, setScroll } =
    useActivity();
  const dateInputRef = useRef(null);

  const handleDivClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  return (
    <>
      {/* Add location */}
      <i
        className="fa-solid fa-square-plus map-btn top-0"
        title="Add Location"
        onClick={() => setShowMap((prev) => !prev)}
      ></i>

      {/* Filter by date */}
      <div
        className="map-btn top-10"
        title="Date Filter"
        onClick={handleDivClick}
      >
        <i className="fa-regular fa-calendar"></i>
        <input
          ref={dateInputRef}
          type="date"
          className="w-0 absolute right-0 bottom-0"
          min={removeTime(itinerary.startDate)}
          max={removeTime(itinerary.endDate)}
          name="filterDate"
          onChange={(e) => {
            setFilterDate(e.target.value);
          }}
          value={filterDate}
        />
      </div>

      {/* Toggle scroll */}
      <i
        className={`fa-solid fa-toggle-${scroll ? "on" : "off"} top-20 map-btn`}
        title="Scroll Toggle"
        onClick={() => setScroll((prev) => !prev)}
      ></i>

      {/* Clear filter */}
      {filterDate && (
        <i
          className="fa-solid fa-xmark top-[120px] map-btn"
          title="Clear Filter"
          onClick={clearFilter}
        ></i>
      )}
    </>
  );
}
