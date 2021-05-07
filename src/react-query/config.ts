import { QueryClient, QueryCache } from "react-query";

export const cache = new QueryCache();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
  queryCache: cache,
});
