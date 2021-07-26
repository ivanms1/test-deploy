import React from "react";

import FilesHorizontalViewer from "../../../components/FilesHorizontalViewer";
import Spinner from "../../../components/Spinner";
import EmptyCategory from "./EmptyCategory";

import useGetContentBy from "../../../hooks/useGetContentBy";

interface CategoryProps {
  categoryId: string;
}

function Category({ categoryId }: CategoryProps) {
  const { files, isLoading } = useGetContentBy({
    formData: [
      { name: "category_id", value: categoryId },
      { name: "order", value: "rate" },
    ],
    id: ["files", categoryId],
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (!files?.length) {
    return <EmptyCategory />;
  }

  return <FilesHorizontalViewer files={files} />;
}

export default Category;
