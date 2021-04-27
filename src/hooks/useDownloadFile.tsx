import { useMutation } from "react-query";

const { api } = window;

type DownloadContent = {
  hash: string;
  publicHash: string;
  userId: number;
  contentId: number;
};

function useDownloadFile() {
  const {
    mutateAsync: downloadFile,
    isLoading,
    mutate,
  } = useMutation("download-file", (args: DownloadContent) =>
    api.downloadFile(args)
  );
  return { downloadFile, isLoading, mutate };
}

export default useDownloadFile;
