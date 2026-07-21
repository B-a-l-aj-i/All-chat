import { USER_ID } from "@/constant";
import { RoomIcon } from "./RoomIcon";
import { FONT } from "./constants";

export function SidebarRoom({
  name,
  description,
  active,
  owner_id,
  onClick,
}: {
  name: string;
  description?: string | null;
  active?: boolean;
  owner_id?: string | null;
  onClick?: () => void;
}) {
  const isOwner = owner_id === USER_ID;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`items-center flex w-full text-left py-3.75 px-[22.5px] gap-3.75 cursor-pointer ${active ? "bg-[#E5E7EB]" : "bg-white hover:bg-[#F5F5F4]"}`}
    >
      <RoomIcon />
      <div className="grow min-w-0">
        <div
          className={`text-[15px] leading-[150%] ${FONT} font-semibold text-[#0C0A09] truncate`}
        >
          {name}
        </div>
        {description ? (
          <div
            className={`${FONT} text-[#78716C] text-[13.125px]/[18.75px] truncate`}
          >
            {description}
          </div>
        ) : null}
      </div>
      <span
        className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-[3px] ${FONT} text-[11.25px]/[15px] font-medium tracking-wide ${
          isOwner
            ? "bg-[#EDEBFE] text-[#6D28D9]"
            : "bg-[#F5F5F4] text-[#78716C] border border-solid border-[#E7E5E4]"
        }`}
      >
        {isOwner ? "Owner" : "Member"}
      </span>
    </button>
  );
}
