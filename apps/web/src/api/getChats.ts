import { API_URL } from "@/constant";

export interface Chat {
  id: string;
  room_id: string;
  user_id: string;
  username: string;
  text: string;
  created_at: string;
}

export async function getChats(roomId: string): Promise<Chat[]> {
  const res = await fetch(
    `${API_URL}/chats?room_id=${encodeURIComponent(roomId)}`,
  );
  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error ?? "Could not load chats");
  }

  return result;
}
