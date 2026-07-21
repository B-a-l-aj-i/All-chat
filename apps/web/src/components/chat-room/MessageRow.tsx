import { UserRound } from "lucide-react";
import { MessageBody } from "./MessageBody";
import { FONT } from "./constants";
import { userColor } from "./userColor";
import type { Message } from "./types";

export function MessageRow({ message }: { message: Message }) {
  // Username is never shown (anonymous) — it only drives a stable per-user color.
  const { avatarBg } = userColor(message.username ?? "Anonymous");
  const { mine, owner } = message;

  return (
    <div
      className={`mt-[22.5px] first:mt-0 flex w-full gap-3 ${mine ? "flex-row-reverse" : ""}`}
    >
      {/* Anonymous avatar. Owner gets a glossy gold treatment with a shine
          that sweeps across; everyone else is a solid per-user color. */}
      {owner ? (
        <div
          aria-hidden
          className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full flex items-center justify-center ring-1 ring-amber-200/80"
          style={{
            background:
              "linear-gradient(135deg,#FDE68A 0%,#F59E0B 48%,#B45309 100%)",
          }}
        >
          <UserRound size={20} className="text-white" strokeWidth={2.2} />
          <span
            className="owner-shine pointer-events-none absolute top-0 left-0 h-full w-1/2"
            style={{
              background:
                "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.9) 50%, transparent 80%)",
            }}
          />
        </div>
      ) : (
        <div
          aria-hidden
          className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center"
          style={{ backgroundColor: avatarBg }}
        >
          <UserRound size={20} className="text-white" strokeWidth={2} />
        </div>
      )}

      <div className={`min-w-0 flex flex-col ${mine ? "items-end" : "items-start"}`}>
        <div className="inline-block max-w-160">
          <MessageBody message={message} />
        </div>
        <span className={`mt-[3px] ${FONT} text-[#78716C] text-[11.25px]/[15px]`}>
          {message.time}
        </span>
      </div>
    </div>
  );
}
