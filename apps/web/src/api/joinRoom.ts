import { API_URL } from "@/constant";

export interface JoinRoomInput {
  room_name: string;
  password: string;
  user_id: string;
}

export async function joinRoom(data: JoinRoomInput) {
  const res = await fetch(`${API_URL}/join-room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error ?? "Could not join room");
  }

  return result;
}
