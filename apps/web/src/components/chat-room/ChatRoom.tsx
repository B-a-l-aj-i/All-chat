/**
 * Chat room UI, ported from the Paper design export.
 * https://app.paper.design/file/01KQBT5PKKJT1N5SE4SHE6AKCT/1-0/9TQ-0
 *
 * Container: owns the room selection + message state and wires the socket.
 * Presentation lives in the sibling components (Sidebar, Conversation, …).
 */
import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";
import { useMyRooms } from "@/hooks/useMyRooms";
import { Conversation } from "./Conversation";
import { Sidebar } from "./Sidebar";
import { formatTime } from "./formatTime";
import type { IncomingMessage, Message } from "./types";

export default function ChatRoom({ onLeave }: { onLeave?: () => void }) {
  const { data: rooms = [], isLoading } = useMyRooms();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedRoom = rooms.find((room) => room.id === selectedId) ?? null;

  // Default to the first room once the list loads.
  useEffect(() => {
    if (!selectedId && rooms.length > 0) {
      setSelectedId(rooms[0].id);
    }
  }, [rooms, selectedId]);

  // Reset the conversation when switching rooms.
  useEffect(() => {
    setMessages([]);
  }, [selectedId]);

  // Receive messages from other members of the room.
  useEffect(() => {
    const onMessage = (payload: IncomingMessage | string) => {
      const text = typeof payload === "string" ? payload : payload?.text;
      if (!text) return;
      const at = typeof payload === "string" ? Date.now() : payload.at;
      setMessages((prev) => [
        ...prev,
        { kind: "text", mine: false, text, time: formatTime(at) },
      ]);
    };
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, []);

  // Keep the conversation pinned to the latest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text || !selectedId) return;
    socket.emit("message", { roomId: selectedId, text });
    setMessages((prev) => [
      ...prev,
      { kind: "text", mine: true, text, time: formatTime(Date.now()) },
    ]);
    setDraft("");
  };

  return (
    <div className="[font-synthesis:none] h-full p-11.25 bg-[#F5F5F4] antialiased text-xs/4 overflow-hidden">
      <div className="flex gap-7.5 h-full">
        <Sidebar
          rooms={rooms}
          isLoading={isLoading}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <Conversation
          title={selectedRoom?.room_name ?? "Select a room"}
          onLeave={onLeave}
          messages={messages}
          scrollRef={scrollRef}
          draft={draft}
          onDraftChange={setDraft}
          onSend={send}
        />
      </div>
    </div>
  );
}
