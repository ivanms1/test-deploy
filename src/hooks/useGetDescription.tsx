import { useQuery } from "react-query";

const { api } = window;

function useGetDescription(descriptionHash) {
  const { data, isLoading } = useQuery(
    ["get-description", descriptionHash],
    async () => {
      const data = await api.getFileDescription(descriptionHash);
      const description = new TextDecoder("utf-8").decode(data?.description);
      return description;
    },
    {
      enabled: !!descriptionHash,
    }
  );

  return { data, isLoading };
}

export default useGetDescription;
