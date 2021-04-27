import React from "react";

import FilesHorizontalViewer from "../../../components/FilesHorizontalViewer";
import useGetContentBy from "../../../hooks/useGetContentBy";

interface CategoryProps {
  categoryId: string;
}

function Category({ categoryId }: CategoryProps) {
  const formData = new FormData();
  formData.append("category_id", categoryId);
  formData.append("order_by", "rate");

  const { files } = useGetContentBy({ formData, id: ["files", categoryId] });

  return <FilesHorizontalViewer files={files} />;
}

export default Category;
