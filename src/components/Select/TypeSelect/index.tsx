import React from "react";
import { useQuery } from "react-query";
import Select from "react-select";

import customStyles from "../styles";

const { api } = window;

interface TypeSelectProps {
  value: any;
  onChange: () => void;
}

function TypeSelect({ ...props }: TypeSelectProps) {
  const { data } = useQuery("get-all-types", async () => {
    const { data } = await api.getContentTypes();
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
