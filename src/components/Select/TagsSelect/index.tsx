import React from "react";
import { useMutation } from "react-query";
import AsyncCreatableSelect from "react-select/async-creatable";

import instance from "../../../axios/instance";

import customStyles from "../styles";

interface TagsSelectProps {
  value: unknown[];
  onChange: (values: any) => void;
  isMulti?: boolean;
  formatCreateLabel?: (value: string) => string;
  createOptionPositon: "first" | "last";
  placeholder?: string;
}

function TagsSelect({ ...props }: TagsSelectProps) {
  const { mutateAsync: search } = useMutation(async (inputValue) => {
    const { data } = await instance.get(
      `/search/tag/autocomplete?tag=${inputValue}`
    );
    return data;
  });

  const promiseOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(async () => {
        let data;
        if (inputValue) {
          data = await search(inputValue);
        }
        resolve(data?.data?.map((tag) => ({ value: tag, label: tag })) ?? []);
      }, 100);
    });

  return (
    <AsyncCreatableSelect
      cacheOptions
      defaultOptions
      styles={{
        ...customStyles,
        control: (provided) => ({
          ...customStyles.control(provided),
          height: 64,
        }),
      }}
      loadOptions={promiseOptions}
      {...props}
    />
  );
}

export default TagsSelect;
