import { useMutation } from "react-query";

const { api } = window;

type LikeContent = {
  publicHash: string;
  userId: number;
  contentId: number;
};

function useLikeContent() {
  const {
    mutateAsync: likeContent,
    isLoading,
    mutate,
  } = useMutation(
    "like-content",
    ({ publicHash, userId, contentId }: LikeContent) =>
      api.likeContent({ publicHash, userId, contentId })
  );
  return { likeContent, isLoading, mutate };
}

export default useLikeContent;
