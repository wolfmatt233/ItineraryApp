import { usePage } from "../App";

export default function Error({ message }) {
  const { setPage } = usePage();

  return (
    <div className="page-layout">
      <p className="text-lg py-2 border-b mb-3">Error</p>
      <p>{message}</p>
      <button onClick={() => setPage("itineraries")}>
        Go to your itineraries
      </button>
    </div>
  );
}
