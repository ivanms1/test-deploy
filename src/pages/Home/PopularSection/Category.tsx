import React from "react";

import FilesHorizontalViewer from "../../../components/FilesHorizontalViewer";
import Spinner from "../../../components/Spinner";

import useGetContentBy from "../../../hooks/useGetContentBy";

interface CategoryProps {
  categoryId: string;
}

function Category({ categoryId }: CategoryProps) {
  const formData = new FormData();
  formData.append("category_id", categoryId);
  formData.append("order_by", "rate");

  const { files, isLoading } = useGetContentBy({
    formData,
    id: ["files", categoryId],
  });

  if (isLoading) {
    return <Spinner />;
  }

  return <FilesHorizontalViewer files={files} />;
}

export default Category;
