import { createFileRoute } from "@tanstack/react-router";

import ChatRoom  from "@/components/ChatRoom";

export const Route = createFileRoute("/my-rooms")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ChatRoom />
}
