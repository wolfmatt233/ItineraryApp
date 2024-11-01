export default function DeleteModal({ id, setModal, setItineraries }) {
  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/itineraries/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setItineraries((prev) => prev.filter((item) => item._id != id));
        alert(data.message);
      }
    } catch (error) {
      alert("Deletion failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
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
