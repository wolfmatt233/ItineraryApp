import { useItinerary } from "../../pages/itinerary/Itinerary";
import { apiRequests } from "../../requests/apiRequests";
import { useActivity } from "../view/Activities";

export default function DeleteActivity({ modal }) {
  const { itinerary, setItinerary } = useItinerary();
  const { setModal } = useActivity();
  const { deleteActivity } = apiRequests();

  const handleDelete = async (e) => {
    e.preventDefault();

    const res = await deleteActivity(modal);
    const { response, data } = res;

    if (response.ok) {
      const newActivities = itinerary.activities.filter(
        (item) => item._id !== modal
      );

      const updatedItinerary = { ...itinerary, activities: newActivities };
      setItinerary(updatedItinerary);
      setModal(false);
    } else {
      alert("Deletion failed.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[5000]">
      <div className="login-modal bg-white">
        <p className="text-lg text-center">Are you sure?</p>
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
