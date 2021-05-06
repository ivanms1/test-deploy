import { useQuery } from "react-query";
import instance from "../axios/instance";

function useGetFile(id) {
  const { data, isLoading } = useQuery(
    [id, "get-file"],
    async () => {
      const { data } = await instance.get(`/content/${id}`);
      return data;
    },
    { enabled: !!id, refetchOnMount: "always" }
  );

  return { data, isLoading };
}

export default useGetFile;
