import { useItinerary } from "../../pages/Itinerary";

export default function DeleteActivity({ modal, setModal, setActivities }) {
  const { itinerary, setItinerary } = useItinerary();
  
  const handleDelete = async (e) => {
    e.preventDefault();

    const newActivities = itinerary.activities.filter(
      (item) => item._id !== modal
    );

    const updatedItinerary = { ...itinerary, activities: newActivities };

    try {
      const response = await fetch(
        `http://localhost:5000/api/itineraries/${itinerary._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedItinerary),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setItinerary(updatedItinerary);
        setActivities(newActivities);
        setModal(false);
      }
    } catch (error) {
      console.log(error);
      setModal(false);
      alert("Deletion failed");
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
