import React from "react";
import { useMutation } from "react-query";
import AsyncCreatableSelect from "react-select/async-creatable";

import instance from "../../../axios/instance";

import customStyles from "./styles";

interface SearchSelectProps {
  isTagSearch?: boolean;
  className: any;
  onChange: (values: any) => void;
  formatCreateLabel?: (value: string) => string;
  placeholder?: string;
  allowCreateWhileLoading: boolean;
  createOptionPosition: string;
}

function SearchSelect({ isTagSearch, ...props }: SearchSelectProps) {
  const { mutateAsync: search } = useMutation(async (inputValue) => {
    const { data } = await instance.get(
      `/search/content/autocomplete?keyword=${inputValue}`
    );
    return data;
  });

  const { mutateAsync: searchTags } = useMutation(async (inputValue) => {
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
          if (isTagSearch) {
            data = await searchTags(inputValue);
          } else {
            data = await search(inputValue);
          }
        }
        resolve(data?.data?.map((tag) => ({ value: tag, label: tag })) ?? []);
      }, 100);
    });

  return (
    <AsyncCreatableSelect
      cacheOptions
      defaultOptions
      styles={customStyles}
      loadOptions={promiseOptions}
      {...props}
    />
  );
}

export default SearchSelect;
