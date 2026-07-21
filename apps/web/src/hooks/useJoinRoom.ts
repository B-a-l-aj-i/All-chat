import { joinRoom } from "@/api/joinRoom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useJoinRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-rooms"],
      });
    },
  });
}
