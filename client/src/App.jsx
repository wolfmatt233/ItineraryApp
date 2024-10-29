import { useEffect, useState } from "react";

export default function App() {
  const [page, setPage] = useState("");
  const [itineraries, setItineraries] = useState([]);

  const suffix = (day) => {
    const lastDigit = day % 10;
    if (lastDigit === 1 && day !== 11) return "st";
    if (lastDigit === 2 && day !== 12) return "nd";
    if (lastDigit === 3 && day !== 13) return "rd";
    return "th";
  };

  useEffect(() => {
    setItineraries([]);

    const handlePageChange = async () => {
      switch (page) {
        case "index":
          const response = await fetch("http://localhost:5000/api/itineraries");
          const data = await response.json();
          setItineraries(data.items);
          break;
        case "":
          break;
      }
    };

    handlePageChange();
  }, [page]);

  return (
    <div>
      <a onClick={() => setPage("")}>Home</a>
      <a onClick={() => setPage("index")}>Itineraries</a>
      {itineraries.map((item, idx) => {
        return (
          <div key={idx}>
            <p>{item.title}</p>
            <p>{item.startDate.split("T")[0]}</p>
            <p>{item.endDate.split("T")[0]}</p>
          </div>
        );
      })}
    </div>
  );
}
