import { API_URL } from "@/constant";

export interface Room {
  id: string;
  room_name: string;
  description: string | null;
  owner_id: string | null;
}

export async function getMyRooms(userId: string): Promise<Room[]> {
  const res = await fetch(
    `${API_URL}/my-rooms?userId=${encodeURIComponent(userId)}`,
  );
  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error ?? "Could not load rooms");
  }

  return result;
}
