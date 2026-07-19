import { Button } from "@all-chat/ui/components/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import CreateRoom from "@/components/CreateRoom";
import JoinRoom from "@/components/JoinRoom";
import RoomChat from "@/components/RoomChat";
import { socket } from "@/lib/socket";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const [roomId, setRoomId] = useState<string | null>(null);

  if (roomId) {
    return (
      <main className="relative flex h-full flex-col items-center bg-background px-6 py-10">
        <div className="flex w-full max-w-2xl flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Room: {roomId}
            </h2>
            <Button
              variant="outline"
              className="rounded-md cursor-pointer"
              onClick={() => {
                socket.emit("leave-room", roomId);
                setRoomId(null);
              }}
            >
              Leave
            </Button>
          </div>
          {roomId}
          <RoomChat roomId={roomId} />
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex h-full flex-col items-center overflow-hidden bg-background px-6">
      <div className="flex w-full max-w-4xl flex-1 flex-col items-center justify-center pb-24 text-center">
        <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-5xl">
          <span className="whitespace-nowrap">Anonymous Chat System for</span>
          <br />
          <div className="relative h-8 my-3">
            <span className="absolute inset-0 text-emerald-500 opacity-0 animate-[rotateWords_3s_linear_infinite]">
              Employee Feedback
            </span>

            <span className="absolute inset-0 text-violet-500 opacity-0 animate-[rotateWords_3s_linear_2s_infinite]">
              Blind Suggestions
            </span>

            <span className="absolute inset-0 text-blue-500 opacity-0 animate-[rotateWords_3s_linear_4s_infinite]">
              Vote and Reviews
            </span>
          </div>
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Create anonymous spaces where teams can discuss ideas, conduct polls,
          and provide honest feedback without revealing their identity.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <CreateRoom />
          {/* <Button variant="ghost" className="rounded-3xl p-4 cursor-pointer">
            Join Room
          </Button> */}
          <JoinRoom onJoined={setRoomId} />
        </div>
      </div>
    </main>
  );
}
