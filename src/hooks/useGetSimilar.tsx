import { useQuery } from "react-query";

const { api } = window;

function useGetSimilar(contentID) {
  const { data, isLoading } = useQuery(
    ["similar-products", contentID],
    async () => {
      const { data } = await api.getSimilarContent(contentID);

      return data.data;
    },
    {
      enabled: !!contentID,
    }
  );
  return { data, isLoading };
}

export default useGetSimilar;
