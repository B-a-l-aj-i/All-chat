import type { RefObject } from "react";
import { Composer } from "./Composer";
import { ConversationHeader } from "./ConversationHeader";
import { MessageList } from "./MessageList";
import type { Message } from "./types";

export function Conversation({
  title,
  onLeave,
  messages,
  scrollRef,
  draft,
  onDraftChange,
  onSend,
}: {
  title: string;
  onLeave?: () => void;
  messages: Message[];
  scrollRef: RefObject<HTMLDivElement | null>;
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="grow flex flex-col min-w-0">
      <ConversationHeader title={title} onLeave={onLeave} />
      <MessageList messages={messages} scrollRef={scrollRef} />
      <Composer draft={draft} onDraftChange={onDraftChange} onSend={onSend} />
    </div>
  );
}
