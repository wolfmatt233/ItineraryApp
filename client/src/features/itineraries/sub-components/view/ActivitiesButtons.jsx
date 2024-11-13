import { useEffect, useState, useRef } from "react";
import { removeTime } from "../../functions/formatDate";

export default function ActivitiesButtons({
  itinerary,
  setActivities,
  setShowMap,
}) {
  const [filterDate, setFilterDate] = useState("");
  const dateInputRef = useRef(null);

  const handleDivClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const clearFilter = () => {
    setActivities(itinerary.activities);
    setFilterDate("");
  };

  useEffect(() => {
    if (filterDate.length > 0) {
      const newActivities = itinerary.activities.filter((activity) => {
        return removeTime(new Date(activity.date)) === filterDate;
      });

      setActivities(newActivities);
    }
  }, [filterDate]);

  return (
    <>
      <i
        className="fa-solid fa-square-plus text-xl basic-button h-9 w-9 flex items-center justify-center absolute right-3 top-0 z-[1000] cursor-pointer"
        onClick={() => setShowMap((prev) => !prev)}
      ></i>
      <div
        className="text-xl basic-button h-9 w-9 flex items-center justify-center absolute right-3 top-10 z-[1000] cursor-pointer"
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
      {filterDate && (
        <i
          className="fa-solid fa-xmark text-xl basic-button h-9 w-9 flex items-center justify-center absolute right-3 top-[120px] z-[1000] cursor-pointer"
          onClick={clearFilter}
        ></i>
      )}
      {/* <i
        className="fa-solid fa-toggle-on text-xl basic-button h-9 w-9 flex items-center justify-center absolute right-3 top-20 z-[1000] cursor-pointer"
        onClick={setScroll((prev) => !prev)}
      ></i> */}
    </>
  );
}
