import { useMutation } from "react-query";

const { api } = window;

type LikeContent = {
  publicHash: string;
  contentId: number;
};

function useLikeContent() {
  const {
    mutateAsync: likeContent,
    isLoading,
    mutate,
  } = useMutation("like-content", ({ publicHash, contentId }: LikeContent) =>
    api.likeContent({ publicHash, contentId })
  );
  return { likeContent, isLoading, mutate };
}

export default useLikeContent;
