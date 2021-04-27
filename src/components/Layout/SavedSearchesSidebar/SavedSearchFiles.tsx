import React from "react";
import { useQuery } from "react-query";

import FilesHorizontalViewer from "../../FilesHorizontalViewer";

import { useAppContext } from "../../AppContext";

import instance from "../../../axios/instance";

function SavedSearchFiles({ search }) {
  const { isSavedSearchOpen } = useAppContext();
  const { data } = useQuery(
    ["saved-search", search.keyword, search.filter],
    async () => {
      const { data } = await instance(
        `/search/content?keyword=${search?.keyword ?? ""}&filter=${
          search?.filter ?? ""
        }`
      );
      return data;
    },
    {
      enabled: isSavedSearchOpen,
    }
  );

  return <FilesHorizontalViewer files={data?.data?.data} mini />;
}

export default SavedSearchFiles;
