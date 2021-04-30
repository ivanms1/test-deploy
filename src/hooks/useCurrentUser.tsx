import { useQuery } from "react-query";
import { setAuthHeader } from "../helpers/getAuthHeader";

const { api } = window;

function useCurrentUser() {
  const { data: currentUser, refetch } = useQuery(
    "get-current-user",
    async () => {
      const { data } = await api.getCurrentUser();

      return data;
    },
    {
      onSuccess(data) {
        if (data?.id) {
          setAuthHeader(data?.id);
        }
      },
    }
  );

  return {
    currentUser,
    refetch,
  };
}

export default useCurrentUser;
