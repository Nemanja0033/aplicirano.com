import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUserData } from "../service/user-service";
import { useAuthContext } from "@/src/context/AuthProvider";
import { User } from "@/src/types";

export function useCurrentUser() {
  const { token } = useAuthContext();
  const { data: currentUserData, isLoading: isUserLoading } = useQuery<User>({
    queryKey: ["me"],
    queryFn: () => fetchCurrentUserData(token as any),
    enabled: !!token,
    staleTime: 60 * 3000,
  });

  return { currentUserData, isUserLoading }
}
