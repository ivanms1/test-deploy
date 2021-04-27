import { useLocation } from "react-router-dom";

function useUrlQuery() {
  return new URLSearchParams(useLocation().search);
}

export default useUrlQuery;
