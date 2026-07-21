import { CheckCheck } from "lucide-react";
import { FONT } from "./constants";

export function Timestamp({ time, mine }: { time: string; mine: boolean }) {
  return (
    <div className={`items-center flex gap-[7.5px] ${mine ? "justify-end" : ""}`}>
      <div className={`mt-[3.75px] content-center ${FONT} text-[#78716C] text-[13.125px]/[18.75px]`}>
        {time}
      </div>
      {mine && <CheckCheck size={15} className="text-[#22C55E] shrink-0" strokeWidth={2} />}
    </div>
  );
}
