import { createFileRoute } from "@tanstack/react-router";

import ChatRoom from "@/components/chat-room";

export const Route = createFileRoute("/my-rooms")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ChatRoom />
}
