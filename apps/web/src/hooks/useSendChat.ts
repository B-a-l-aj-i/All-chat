import { sendChat } from "@/api/sendChat";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSendChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendChat,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chats", variables.room_id],
      });
    },
  });
}
