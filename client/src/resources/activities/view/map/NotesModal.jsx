export default function NotesModal({ activity, setNoteModal }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[5000]">
      <div className="modal w-3/4 bg-white">
        <p className="text-lg font-semibold">Activity</p>
        <p>{activity.notes}</p>
      </div>
    </div>
  );
}
