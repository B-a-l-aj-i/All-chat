// Shared icon for every room (sidebar rows + conversation header).
// Swap /public/room-icon.svg to change it everywhere.
export function RoomIcon() {
  return (
    <div className="h-11.25 w-11.25 shrink-0 rounded-full bg-[#EDEBFE] flex items-center justify-center overflow-hidden">
      <img src="/room-icon.svg" alt="" className="h-6 w-6" />
    </div>
  );
}
