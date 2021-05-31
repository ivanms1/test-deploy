import { useMutation } from "react-query";

const { api } = window;

function useUpdateLaterList() {
  const { mutateAsync: updateList, isLoading } = useMutation<any>(
    "update-later-list",
    async (newList: any) => {
      const { list } = await api.updateLaterList(newList);

      return list.list;
    }
  );

  return {
    updateList,
    isLoading,
  };
}

export default useUpdateLaterList;
