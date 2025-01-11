import { itineraryRequests } from "../../requests/itineraryRequests";

export default function DeleteItinerary({
  id,
  name,
  setModal,
  setItineraries,
}) {
  const { deleteItinerary } = itineraryRequests();

  const handleDelete = async (e) => {
    e.preventDefault();

    const res = await deleteItinerary(id);
    const { response, data } = res;

    if (response.ok) {
      setItineraries((prev) => prev.filter((item) => item._id != id));
      setModal(false);
    } else {
      alert(`Error ${response.status}: ${data.error}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
      <div className="modal w-1/2 bg-white">
        <p className="text-lg text-center">
          Are you sure you want to delete <b>{name}</b>?
        </p>
        <form className="flex justify-evenly mt-3">
          <button
            className="border border-gray-300 hover:bg-gray-200 mr-2 w-1/2"
            onClick={() => setModal(false)}
          >
            Cancel
          </button>
          <button
            className="text-white w-1/2 h-9 bg-[#fc4a1a] hover:bg-[#fc1a1a]"
            onClick={handleDelete}
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
