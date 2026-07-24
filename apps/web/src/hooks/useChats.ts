import { getChats } from "@/api/getChats";
import { USER_ID } from "@/constant";
import { useQuery } from "@tanstack/react-query";

export function useChats(roomId: string | null) {
  return useQuery({
    queryKey: ["chats", roomId],
    queryFn: () => getChats(roomId!, USER_ID),
    enabled: !!roomId,
  });
}
