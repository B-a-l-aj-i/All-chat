import { API_URL } from "@/constant";

export interface SendChatInput {
  room_id: string;
  user_id: string;
  text: string;
}

export async function sendChat(data: SendChatInput) {
  const res = await fetch(`${API_URL}/chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error ?? "Could not send message");
  }

  return result;
}
