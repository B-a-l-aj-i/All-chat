import type { RefObject } from "react";
import { MessageRow } from "./MessageRow";
import { FONT } from "./constants";
import type { Message } from "./types";

export function MessageList({
  messages,
  scrollRef,
}: {
  messages: Message[];
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex-1 min-h-0 w-full py-3.75 overflow-hidden relative">
      <div ref={scrollRef} className="overflow-y-auto size-full">
        <div className="flex flex-col items-start py-7.5">
          {messages.length === 0 ? (
            <div className={`w-full text-center ${FONT} text-[#78716C] text-[13.125px]/[18.75px]`}>
              No messages yet — say something to start the conversation.
            </div>
          ) : (
            messages.map((message, i) => <MessageRow key={i} message={message} />)
          )}
        </div>
      </div>
      <div
        className="h-12.5 top-0 absolute inset-x-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(in oklab 180deg, oklab(97% -.0004 0.001) 30%, oklab(97% -.0004 0.001 / 0%) 100%)",
        }}
      />
    </div>
  );
}
