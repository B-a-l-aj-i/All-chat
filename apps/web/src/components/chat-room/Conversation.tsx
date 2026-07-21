import type { RefObject } from "react";
import { Composer } from "./Composer";
import { ConversationHeader } from "./ConversationHeader";
import { MessageList } from "./MessageList";
import type { Message } from "./types";

export function Conversation({
  title,
  description,
  onLeave,
  messages,
  scrollRef,
  isLoading,
  draft,
  onDraftChange,
  onSend,
}: {
  title: string;
  description?: string | null;
  onLeave?: () => void;
  messages: Message[];
  scrollRef: RefObject<HTMLDivElement | null>;
  isLoading?: boolean;
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="grow flex flex-col min-w-0">
      <ConversationHeader title={title} description={description} onLeave={onLeave} />
      <MessageList messages={messages} scrollRef={scrollRef} isLoading={isLoading} />
      <Composer draft={draft} onDraftChange={onDraftChange} onSend={onSend} />
    </div>
  );
}
