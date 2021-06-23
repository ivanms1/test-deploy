import { useQuery } from "react-query";

const { api } = window;

function useGetUploads({ authorID, limit }) {
  const { data, isLoading } = useQuery(
    ["uploads", authorID],
    async () => {
      const { data } = await api.getContentBy([
        { name: "user_id", value: authorID },
        { name: "order_by", value: "date" },
        { name: "limit", value: limit },
      ]);
      return data.data;
    },
    {
      refetchOnMount: "always",
      enabled: !!authorID,
    }
  );
  return { data, isLoading };
}

export default useGetUploads;
