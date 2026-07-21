import { Ellipsis } from "lucide-react";
import { RoomIcon } from "./RoomIcon";
import { FONT } from "./constants";

export function ConversationHeader({
  title,
  description,
  onLeave,
}: {
  title: string;
  description?: string | null;
  onLeave?: () => void;
}) {
  return (
    <div className="relative flex flex-col items-center gap-1.5 pb-3.75">
      <RoomIcon />
      <div className="flex flex-col items-center gap-0.5 max-w-md">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#22C55E]" aria-hidden />
          <span className={`text-[15px] leading-[150%] ${FONT} font-semibold text-[#0C0A09]`}>
            {title}
          </span>
        </div>
        {description ? (
          <p className={`${FONT} text-[#78716C] text-[13.125px]/[18.75px] text-center line-clamp-1`}>
            {description}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onLeave}
        aria-label="Leave room"
        className="items-center h-[37.5px] flex w-[37.5px] justify-center rounded-[5.5px] shrink-0 cursor-pointer hover:bg-[#E5E7EB] absolute right-0 top-0"
      >
        <Ellipsis size={15} className="text-[#0C0A09] shrink-0" strokeWidth={2} />
      </button>
    </div>
  );
}
