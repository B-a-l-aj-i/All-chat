import { Ellipsis } from "lucide-react";
import { RoomIcon } from "./RoomIcon";
import { FONT } from "./constants";

export function ConversationHeader({
  title,
  onLeave,
}: {
  title: string;
  onLeave?: () => void;
}) {
  return (
    <div className="flex justify-between gap-3.75">
      <div className="flex gap-3.75">
        <RoomIcon />
        <div className="flex flex-col">
          <div className={`text-[15px] leading-[150%] ${FONT} font-semibold text-[#0C0A09]`}>
            {title}
          </div>
          <div className={`${FONT} text-[#22C55E] text-[13.125px]/[18.75px]`}>Online</div>
        </div>
      </div>
      <button
        type="button"
        onClick={onLeave}
        aria-label="Leave room"
        className="items-center h-[37.5px] flex w-[37.5px] justify-center rounded-[5.5px] shrink-0 cursor-pointer hover:bg-[#E5E7EB]"
      >
        <Ellipsis size={15} className="text-[#0C0A09] shrink-0" strokeWidth={2} />
      </button>
    </div>
  );
}
