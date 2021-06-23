import { useQuery } from "react-query";

import useCurrentUser from "./useCurrentUser";

const { api } = window;

function useGetDownloads({ enabled, limit }) {
  const { currentUser } = useCurrentUser();
  const { data, isLoading } = useQuery(
    ["downloads", currentUser?.id],
    async () => {
      const { data } = await api.getDownloads({ limit });
      return data.data;
    },
    { enabled, refetchOnMount: "always" }
  );
  return { data, isLoading };
}

export default useGetDownloads;
