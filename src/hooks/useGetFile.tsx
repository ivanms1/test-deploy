import { useQuery } from "react-query";

import { NO_BAD_FILE, NO_USER } from "../const";

const { api } = window;

function useGetFile(id) {
  const { data, isLoading } = useQuery(
    [id, "get-file"],
    async () => {
      const { data } = await api.getFile(id);
      return data;
    },
    {
      enabled: !!id && id !== NO_USER && id !== NO_BAD_FILE,
      refetchOnMount: "always",
    }
  );

  return { data, isLoading };
}

export default useGetFile;
