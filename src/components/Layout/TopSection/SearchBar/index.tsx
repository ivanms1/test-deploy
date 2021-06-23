import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../../Button";
import SaveSearchModal from "./SaveSearchModal";
import SearchSelect from "../../../Select/SearchSelect";
import Filters from "./Filters";

import QRDropZone from "./QRDropZone";

import useReadQRCode from "../../../../hooks/useReadQRCode";
import useUrlQuery from "../../../../hooks/useUrlQuery";

import Glass from "../../../../assets/icons/magnifying-glass.svg";
import Tag from "../../../../assets/icons/tag.svg";
import Hashtag from "../../../../assets/icons/hashtag.svg";
import Title from "../../../../assets/icons/title.svg";
import AllIcon from "../../../../assets/icons/all.svg";

import styles from "./SearchBar.module.scss";

const filters = [
  { value: "", label: "All", icon: AllIcon },
  {
    value: "title",
    label: "Title",
    icon: Title,
  },
  { value: "tags", label: "Tags", icon: Tag },
  { value: "cid", label: "Hash ID", icon: Hashtag },
];

interface SearchFormData {
  searchString: string;
  filterBy: string;
}

function SearchBar() {
  const [searchToSave, setSearchToSave] = useState(null);

  const history = useHistory();
  const { readCode } = useReadQRCode();

  const queryParams = useUrlQuery();
  const keywordQuery = queryParams.get("keyword");
  const tagQuery = queryParams.get("filter");

  const { control, handleSubmit, getValues, watch, reset } =
    useForm<SearchFormData>({
      defaultValues: {
        filterBy: tagQuery || "",
        searchString: keywordQuery || "",
      },
    });

  useEffect(() => {
    reset({
      filterBy: tagQuery || "",
      searchString: keywordQuery || "",
    });
  }, [keywordQuery, tagQuery]);

  const handleSearch: SubmitHandler<SearchFormData> = async (values) => {
    history.push(
      `/search?keyword=${values.searchString}&filter=${values.filterBy}&page=1`
    );
  };

  const handleModal = () => {
    const values = getValues();
    if (values.searchString) {
      setSearchToSave({
        keyword: values.searchString.trim(),
        filter: values.filterBy.trim(),
      });
    }
  };

  const watchedFilter = watch("filterBy", "");

  const currentFilter = filters?.find((f) => f?.value === watchedFilter);

  const handleQRLink = async (drop: File) => {
    const result = await readCode(drop.path);
    if (result.success) {
      history.push(result.qrDecode);
    } else {
      toast.warn("QR Code Link is invalid");
    }
  };

  return (
    <div className={styles.SearchBarContainer}>
      <QRDropZone onDrop={(a) => handleQRLink(a[0])} noClick>
        <form onSubmit={handleSubmit(handleSearch)} className={styles.Form}>
          <Glass className={styles.Glass} />
          <Controller
            name="searchString"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SearchSelect
                className={styles.SearchBar}
                onChange={(value, method) => {
                  onChange(value);
                  if (method === "click" || method === "enter") {
                    handleSearch(getValues());
                  }
                }}
                value={value}
                placeholder="Search..."
                isTagSearch={watchedFilter === "tags"}
              />
            )}
            rules={{
              required: true,
            }}
          />
          <Filters
            control={control}
            filters={filters}
            currentFilter={currentFilter}
          />
        </form>
      </QRDropZone>
      <Button
        type="button"
        onClick={handleModal}
        noStyle
        className={styles.SaveButton}
      >
        Save this search
      </Button>
      <SaveSearchModal
        isOpen={!!searchToSave}
        search={searchToSave}
        onClose={() => setSearchToSave(null)}
      />
    </div>
  );
}

export default SearchBar;
