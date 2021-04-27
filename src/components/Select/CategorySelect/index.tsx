import React from "react";
import { useQuery } from "react-query";
import Select, { OptionTypeBase } from "react-select";

import instance from "../../../axios/instance";

import customStyles from "../styles";

interface CategorySelectProps {
  value: any;
  onChange: () => void;
}

function CategorySelect({ ...props }: CategorySelectProps) {
  const { data } = useQuery("get-all-categories", async () => {
    const { data } = await instance.get("/cate/get_all");
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
