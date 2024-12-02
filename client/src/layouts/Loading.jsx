// export default function Loading() {
//   return (
//     <div className="flex items-center justify-center page-layout">
//       <i className="fas fa-circle-notch fa-spin text-5xl text-black"></i>
//     </div>
//   );
// }

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[6000] flex items-center justify-center">
      <i className="fas fa-circle-notch fa-spin text-5xl text-white"></i>
    </div>
  );
}