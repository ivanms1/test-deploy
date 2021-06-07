import { useQuery } from "react-query";

const { api } = window;

function useGetPeers() {
  const { data, isFetching, error, refetch } = useQuery(
    ["get-peers"],
    async () => {
      const data = await api.getPeers();
      return data;
    },
    {
      refetchInterval: 60000,
    }
  );

  return { data, isFetching, error, refetch };
}

export default useGetPeers;
