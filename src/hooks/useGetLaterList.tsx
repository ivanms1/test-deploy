import { useQuery } from "react-query";

const { api } = window;

function useGetLaterList() {
  const { data: list, refetch } = useQuery("get-later-list", async () => {
    const { list } = await api.getLaterList();

    return list.list;
  });

  return {
    list,
    refetch,
  };
}

export default useGetLaterList;
