import { useQuery } from "react-query";
import instance from "../axios/instance";

function useGetSimilar(contentID) {
  const { data, isLoading } = useQuery(
    ["similarProducts", contentID],
    async () => {
      // Not sending limit - using default (10)
      // Possible to add offset too, for scrolling
      const { data } = await instance.get(
        `/content/similar-contents/${contentID}`
      );
      return data.data;
    },
    {
      enabled: !!contentID,
    }
  );
  return { data, isLoading };
}

export default useGetSimilar;
