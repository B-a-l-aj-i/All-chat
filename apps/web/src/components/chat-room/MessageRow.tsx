import { MessageBody } from "./MessageBody";
import { MoreButton } from "./MoreButton";
import { Timestamp } from "./Timestamp";
import type { Message } from "./types";

export function MessageRow({ message }: { message: Message }) {
  const { mine } = message;
  return (
    <div className={`mt-[37.5px] max-w-160 first:mt-0 ${mine ? "self-end" : ""}`}>
      <div className="items-center flex gap-[7.5px]">
        {mine && <MoreButton />}
        <div className={mine ? "order-1" : ""}>
          <MessageBody message={message} />
        </div>
        {!mine && <MoreButton />}
      </div>
      <Timestamp time={message.time} mine={mine} />
    </div>
  );
}
