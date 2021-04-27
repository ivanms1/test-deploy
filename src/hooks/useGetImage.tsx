import { useQuery } from "react-query";

const { api } = window;

function useGetImage(thumbHash: string) {
  const { data, isLoading, error, refetch } = useQuery(
    ["get-preview", thumbHash],
    async () => {
      const data = await api.getFilePreview(thumbHash);

      const preview = new Blob([data?.preview?.buffer]);
      return URL.createObjectURL(preview);
    },
    {
      enabled: !!thumbHash,
      refetchOnMount: true,
    }
  );

  return { data, isLoading, error, refetch };
}

export default useGetImage;
