import React, { useState } from "react";
import { useMutation } from "react-query";
import Autosuggest from "react-autosuggest";
import classNames from "classnames";

import instance from "../../../axios/instance";

import styles from "./SearchSelect.module.scss";

interface SearchSelectProps {
  isTagSearch?: boolean;
  className: any;
  onChange: (
    value: string,
    method: "type" | "down" | "up" | "escape" | "enter" | "click"
  ) => void;
  placeholder?: string;
  value: string;
}

function SearchSelect({
  isTagSearch,
  value = "",
  onChange,
  placeholder,
  className,
}: SearchSelectProps) {
  const [suggestions, setSuggestions] = useState([]);

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

  const onSuggestionFetchRequested = async ({ value }) => {
    let data;

    if (value) {
      if (isTagSearch) {
        data = await searchTags(value);
      } else {
        data = await search(value);
      }

      setSuggestions(data?.data ?? []);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <Autosuggest
      inputProps={{
        value,
        onChange: (e, { newValue, method }) => {
          onChange(newValue, method);
        },
        placeholder,
      }}
      theme={{
        container: classNames(styles.Container, className),
        input: styles.Input,
        suggestionsContainerOpen: styles.SuggestionsContainerOpen,
        suggestionsList: styles.SuggestionsList,
        suggestion: styles.Suggestion,
        suggestionHighlighted: styles.SuggestionHighlighted,
      }}
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionFetchRequested}
      onSuggestionsClearRequested={() => setSuggestions([])}
      getSuggestionValue={(s) => s}
      renderSuggestion={(suggestion) => <div>{suggestion}</div>}
      onSuggestionSelected={(e, { suggestionValue, method }) => {
        if (method === "click" || method === "enter") {
          onChange(suggestionValue, method);
        }
      }}
    />
  );
}

export default SearchSelect;
