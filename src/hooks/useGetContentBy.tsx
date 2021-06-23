import { useQuery } from "react-query";

const { api } = window;

interface UseGetContentByProps {
  formData: unknown[];
  id: string | unknown[];
}

function useGetContentBy({ formData, id }: UseGetContentByProps) {
  const { data, isLoading } = useQuery(
    id,
    async () => {
      const { data } = await api.getContentBy(formData);

      return data;
    },
    { refetchOnMount: "always" }
  );
  return { files: data?.data?.data, isLoading, total: data?.data?.total };
}

export default useGetContentBy;
