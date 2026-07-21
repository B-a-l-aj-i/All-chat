import { getOrCreateUser } from "@/api/createUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateLocalUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: getOrCreateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
    },
  });
}
