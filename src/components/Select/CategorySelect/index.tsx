import React from "react";
import { useQuery } from "react-query";
import Select from "react-select";

import customStyles from "../styles";

const { api } = window;

interface CategorySelectProps {
  value: any;
  onChange: () => void;
}

function CategorySelect({ ...props }: CategorySelectProps) {
  const { data } = useQuery("get-all-categories", async () => {
    const { data } = await api.getCategories();
    return data;
  });

  return (
    <Select
      menuPlacement="top"
      options={
        data?.data?.map((cat) => ({ value: cat.id, label: cat.name })) ?? []
      }
      placeholder=""
      styles={customStyles}
      {...props}
    />
  );
}

export default CategorySelect;
