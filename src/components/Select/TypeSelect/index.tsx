import React from "react";
import { useQuery } from "react-query";
import Select from "react-select";

import instance from "../../../axios/instance";

import customStyles from "../styles";

interface TypeSelectProps {
  value: any;
  onChange: () => void;
}

function TypeSelect({ ...props }: TypeSelectProps) {
  const { data } = useQuery("get-all-types", async () => {
    const { data } = await instance.get("/content_type/get_all");
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

export default TypeSelect;
