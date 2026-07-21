/**
 * Chat room UI, ported from the Paper design export.
 * https://app.paper.design/file/01KQBT5PKKJT1N5SE4SHE6AKCT/1-0/9TQ-0
 *
 * Container: owns room selection and wires messages. The DB is the single
 * source of truth — useChats renders history, a live socket "message" just
 * triggers a refetch, and send persists via useSendChat + pings the socket.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/lib/socket";
import { USER_ID } from "@/constant";
import { useMyRooms } from "@/hooks/useMyRooms";
import { useChats } from "@/hooks/useChats";
import { useSendChat } from "@/hooks/useSendChat";
import { Conversation } from "./Conversation";
import { Sidebar } from "./Sidebar";
import { formatTime } from "./formatTime";
import type { Message } from "./types";

export default function ChatRoom({ onLeave }: { onLeave?: () => void }) {
  const { data: rooms = [], isLoading: isRoomsLoading } = useMyRooms();
  const queryClient = useQueryClient();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedRoom = rooms.find((room) => room.id === selectedId) ?? null;

  const { data: chats = [], isLoading: isChatsLoading } = useChats(selectedId);
  const sendChat = useSendChat();

  // Show the skeleton not only while chats fetch, but also during the gap where
  // rooms have loaded and a room is about to be auto-selected — otherwise the
  // "No messages yet" empty state flashes for a frame and the layout jumps.
  const messagesLoading =
    isRoomsLoading || isChatsLoading || (rooms.length > 0 && !selectedId);

  // Persisted history → the UI Message shape.
  const messages = useMemo<Message[]>(
    () =>
      chats.map((c) => ({
        kind: "text",
        mine: c.user_id === USER_ID,
        owner: !!selectedRoom && c.user_id === selectedRoom.owner_id,
        user_id: c.user_id,
        username: c.username,
        text: c.text,
        time: formatTime(new Date(c.created_at).getTime()),
      })),
    [chats, selectedRoom],
  );

  // Default to the first room once the list loads.
  useEffect(() => {
    if (!selectedId && rooms.length > 0) {
      setSelectedId(rooms[0].id);
    }
  }, [rooms, selectedId]);

  // Join the selected room's socket channel. A live "message" from another
  // member just invalidates the query so history refetches (DB = source of
  // truth). Cleanup leaves the room + removes the listener on switch/unmount.
  useEffect(() => {
    if (!selectedId) return;

    socket.emit("join-room", selectedId);
    const onMessage = () =>
      queryClient.invalidateQueries({ queryKey: ["chats", selectedId] });
    socket.on("message", onMessage);

    return () => {
      socket.emit("leave-room", selectedId);
      socket.off("message", onMessage);
    };
  }, [selectedId, queryClient]);

  // Keep the conversation pinned to the latest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text || !selectedId) return;
    // Persist (invalidates ["chats", roomId] on success so we see it), then
    // ping the room so other members refetch.
    sendChat.mutate({ room_id: selectedId, user_id: USER_ID, text });
    socket.emit("message", { room_id: selectedId, text });
    setDraft("");
  };

  return (
    <div className="[font-synthesis:none] h-full p-11.25 bg-[#F5F5F4] antialiased text-xs/4 overflow-hidden">
      <div className="flex gap-7.5 h-full">
        <Sidebar
          rooms={rooms}
          isLoading={isRoomsLoading}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <Conversation
          title={selectedRoom?.room_name ?? "Select a room"}
          description={selectedRoom?.description}
          onLeave={onLeave}
          messages={messages}
          scrollRef={scrollRef}
          isLoading={messagesLoading}
          draft={draft}
          onDraftChange={setDraft}
          onSend={send}
        />
      </div>
    </div>
  );
}
