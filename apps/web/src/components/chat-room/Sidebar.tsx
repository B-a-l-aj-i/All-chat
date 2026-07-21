import { CirclePlus, Search } from "lucide-react";
import type { Room } from "@/api/getMyRooms";
import { SidebarRoom } from "./SidebarRoom";
import { FONT, bubbleShell } from "./constants";
import CreateRoom from "../CreateRoom";

export function Sidebar({
  rooms,
  isLoading,
  selectedId,
  onSelect,
}: {
  rooms: Room[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="w-90 shrink-0 h-full">
      <div className={`flex flex-col h-full ${bubbleShell}`}>
        <div className="flex flex-col p-[22.5px]">
          <div className="items-center flex justify-between">
            <div
              className={`text-[22.5px] [letter-spacing:-0.5625px] leading-[100%] ${FONT} font-bold text-[#0C0A09]`}
            >
              Rooms
            </div>

            <CreateRoom showIcon={true} />
          </div>
        </div>
        <div className="items-center flex py-[11.25px] px-[22.5px] relative">
          <div className="h-[37.5px] flex w-full items-center pr-[11.25px] pl-[37.5px] rounded-[5.5px] overflow-clip py-[7.5px] bg-white border border-solid border-[#E7E5E4]">
            <input
              className={`flex-1 min-w-0 bg-transparent outline-none ${FONT} text-[#78716C] text-[13.125px]/4 placeholder:text-[#78716C]`}
              placeholder="Chats search..."
            />
          </div>
          <Search
            size={15}
            className="text-[#78716C] left-[37.5px] absolute"
            strokeWidth={2}
          />
        </div>
        <div className="flex-1 min-h-0 pt-3.75 overflow-y-auto">
          {isLoading ? (
            <div
              className={`px-[22.5px] py-3.75 ${FONT} text-[#78716C] text-[13.125px]/[18.75px]`}
            >
              Loading rooms…
            </div>
          ) : rooms.length === 0 ? (
            <div
              className={`px-[22.5px] py-3.75 ${FONT} text-[#78716C] text-[13.125px]/[18.75px]`}
            >
              No rooms yet — create one to get started.
            </div>
          ) : (
            rooms.map((room) => (
              <SidebarRoom
                key={room.id}
                name={room.room_name}
                description={room.description}
                owner_id={room.owner_id}
                active={room.id === selectedId}
                onClick={() => onSelect(room.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
