import { RoomIcon } from "./RoomIcon";
import { FONT } from "./constants";

export function SidebarRoom({
  name,
  description,
  active,
  onClick,
}: {
  name: string;
  description?: string | null;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`items-center flex w-full text-left py-3.75 px-[22.5px] gap-3.75 cursor-pointer ${active ? "bg-[#E5E7EB]" : "bg-white hover:bg-[#F5F5F4]"}`}
    >
      <RoomIcon />
      <div className="grow min-w-0">
        <div className={`text-[15px] leading-[150%] ${FONT} font-semibold text-[#0C0A09] truncate`}>
          {name}
        </div>
        {description ? (
          <div className={`${FONT} text-[#78716C] text-[13.125px]/[18.75px] truncate`}>
            {description}
          </div>
        ) : null}
      </div>
    </button>
  );
}
