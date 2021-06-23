import { useQuery } from "react-query";
import { UserType } from "../types";

const { api } = window;

function useCurrentUser() {
  const {
    data: currentUser,
    refetch,
    isLoading,
  } = useQuery<UserType>("get-current-user", async () => {
    const { data } = await api.getCurrentUser();
    return data;
  });

  return {
    currentUser,
    refetch,
    isLoading,
  };
}

export default useCurrentUser;
