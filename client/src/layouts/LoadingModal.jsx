export default function LoadingModal() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[6000] flex items-center justify-center">
      <i className="fas fa-circle-notch fa-spin text-5xl text-white"></i>
    </div>
  );
}