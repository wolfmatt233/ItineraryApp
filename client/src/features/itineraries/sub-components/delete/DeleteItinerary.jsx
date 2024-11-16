import { apiRequests } from "../../functions/apiRequests";

export default function DeleteItinerary({
  id,
  name,
  setModal,
  setItineraries,
}) {
  const { deleteItinerary } = apiRequests();

  const handleDelete = async (e) => {
    e.preventDefault();

    const res = await deleteItinerary(id);
    const { response, data } = res;

    if (response.ok) {
      setItineraries((prev) => prev.filter((item) => item._id != id));
      setModal(false);
    } else {
      alert("Failed to delete itinerary.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
      <div className="login-modal bg-white">
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
