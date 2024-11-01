import { useEffect, useState } from "react";
import { usePage } from "../App";
import Itineraries from "./itineraries/pages/Itineraries";

export default function Error({ message }) {
  const { setPage } = usePage();

  return (
    <div className="page-layout">
      <p className="text-lg py-2 border-b mb-3">Error</p>
      <p>{message}</p>
      <button onClick={() => setPage(<Itineraries />)}>
        Go to your itineraries
      </button>
    </div>
  );
}
