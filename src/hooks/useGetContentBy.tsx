import { useQuery } from "react-query";

import instance from "../axios/instance";

interface UseGetContentByProps {
  formData: FormData;
  id: string | unknown[];
}

function useGetContentBy({ formData, id }: UseGetContentByProps) {
  const { data, isLoading } = useQuery(
    id,
    async () => {
      const { data } = await instance.post(
        "/content/get-contents-by",
        formData
      );

      return data;
    },
    { refetchOnMount: "always" }
  );
  return { files: data?.data?.data, isLoading, total: data?.data?.total };
}

export default useGetContentBy;
