import { Button } from "@all-chat/ui/components/button";
import { Input } from "@all-chat/ui/components/input";
import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

export default function RoomChat({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const onMessage = (msg: string) => setMessages((prev) => [...prev, msg]);
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, []);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    socket.emit("message", { roomId, text: trimmed });
    setText("");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <Button type="submit" className="rounded-md cursor-pointer">
          Send
        </Button>
      </form>
    </div>
  );
}
