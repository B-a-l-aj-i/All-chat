import { Mic, Paperclip, Smile } from "lucide-react";
import { FONT, bubbleShell } from "./constants";

export function Composer({
  draft,
  onDraftChange,
  onSend,
}: {
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <div className={bubbleShell}>
      <div className="items-center flex p-3.75 relative">
        <div className="h-[37.5px] flex w-full items-center pr-52.5 pl-[11.25px] rounded-[5.5px] overflow-clip py-[7.5px] bg-white border border-solid border-[#00000000]">
          <input
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            className={`flex-1 min-w-0 bg-transparent outline-none ${FONT} text-[#0C0A09] text-[15px]/4.5 placeholder:text-[#78716C]`}
            placeholder="Enter message..."
          />
        </div>
        <div className="items-center flex right-3.75 absolute">
          <div className="flex">
            {[Smile, Paperclip, Mic].map((Icon, i) => (
              <div
                key={i}
                className="items-center h-[41.25px] inline-flex w-[41.25px] justify-center rounded-full"
              >
                <Icon size={15} className="text-[#0C0A09] shrink-0" strokeWidth={2} />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onSend}
            disabled={!draft.trim()}
            className="items-center h-[37.5px] flex justify-center ml-[11.25px] py-[7.5px] px-3.75 rounded-[5.5px] bg-white border border-solid border-[#E7E5E4] cursor-pointer hover:bg-[#F5F5F4] disabled:opacity-50 disabled:cursor-default"
          >
            <div className={`flex text-center w-max shrink-0 ${FONT} font-medium text-[#0C0A09] text-[13.125px]/[18.75px]`}>
              Send
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
