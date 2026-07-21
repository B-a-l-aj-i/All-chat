import { getChats } from "@/api/getChats";
import { useQuery } from "@tanstack/react-query";

export function useChats(roomId: string | null) {
  return useQuery({
    queryKey: ["chats", roomId],
    queryFn: () => getChats(roomId!),
    enabled: !!roomId,
  });
}
