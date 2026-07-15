import { API_URL } from "@/constant";

export interface CreateRoomInput {
  room_name: string;
  description: string;
  password: string;
}

export async function createRoom(data: CreateRoomInput) {
  const res = await fetch(`${API_URL}/create-room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create room");
  }

  return res.json();
}
