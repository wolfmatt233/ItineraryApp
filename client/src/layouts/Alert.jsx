import { usePage } from "../App";

export default function Alert({ status, message }) {
  const { setError } = usePage();

  return (
    <div
      id="modal-background"
      className="fixed inset-0 bg-black bg-opacity-50 z-[7000]"
      onClick={(e) => {
        if (e.target.id === "modal-background") {
          setError(false);
        }
      }}
    >
      <div className="modal min-w-60 bg-white">
        <p className="text-2xl text-center">
          <i
            className={`fa-solid fa-circle-exclamation ${
              status != 200 && "text-red-500"
            } mr-1`}
          ></i>
          {status != 200 ? `Error ${status}` : "Success"}
        </p>
        <hr className="my-2" />
        <p className="text-center">{message}</p>
      </div>
    </div>
  );
}
