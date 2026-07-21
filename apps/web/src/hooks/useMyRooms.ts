import { getMyRooms } from "@/api/getMyRooms";
import { getOrCreateUser } from "@/api/createUser";
import { useQuery } from "@tanstack/react-query";

export function useMyRooms() {
  const { data: userId } = useQuery({
    queryKey: ["me"],
    queryFn: getOrCreateUser,
  });

  return useQuery({
    queryKey: ["my-rooms", userId],
    queryFn: () => getMyRooms(userId!),
    enabled: !!userId,
  });
}
