import { Ellipsis } from "lucide-react";

export function MoreButton() {
  return (
    <div className="items-center h-[37.5px] inline-flex justify-center py-[7.5px] px-3.75 rounded-[5.5px]">
      <Ellipsis size={15} className="text-[#0C0A09] shrink-0" strokeWidth={2} />
    </div>
  );
}
