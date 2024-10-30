import { useEffect, useState } from "react";

export default function Itineraries() {
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    const handlePageChange = async () => {
      const response = await fetch(
        "http://localhost:5000/api/itineraries",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const data = await response.json();
      setItineraries(data.items);
    };

    handlePageChange();
  }, []);

  return (
    <>
      <p>Itineraries</p>
      {itineraries.map((item, idx) => {
        return (
          <div key={idx}>
            <p>{item.title}</p>
            <p>{item.startDate.split("T")[0]}</p>
            <p>{item.endDate.split("T")[0]}</p>
          </div>
        );
      })}
    </>
  );
}
