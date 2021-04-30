import { useQuery } from "react-query";
import instance from "../axios/instance";
import useCurrentUser from "./useCurrentUser";

function useGetDownloads({ enabled, limit }) {
  const { currentUser } = useCurrentUser();
  const { data, isLoading } = useQuery(
    ["downloads", currentUser?.id],
    async () => {
      const { data } = await instance.get(
        `/content/downloaded-by?limit=${limit}`
      );
      return data.data;
    },
    { enabled, refetchOnMount: "always" }
  );
  return { data, isLoading };
}

export default useGetDownloads;
