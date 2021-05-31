import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";

import Button from "../../../Button";
import Popper from "../../../Popper";
import Checkbox from "../../../Form/Checkbox";
import SaveSearchModal from "./SaveSearchModal";
import SearchSelect from "../../../Select/SearchSelect";

import Tag from "../../../../assets/icons/tag.svg";
import Hashtag from "../../../../assets/icons/hashtag.svg";
import Title from "../../../../assets/icons/title.svg";
import Glass from "../../../../assets/icons/magnifying-glass.svg";
import Settings from "../../../../assets/icons/settings.svg";
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
  const params = useParams<{ keyword: string }>();

  const { control, handleSubmit, getValues, watch } = useForm<SearchFormData>({
    defaultValues: { filterBy: params?.keyword ?? "" },
  });

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

  const watchedFilter = watch("filterBy", "all");

  return (
    <div className={styles.SearchBarContainer}>
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
        <Popper
          manager={<Settings className={styles.SettingsIcon} />}
          placement="bottom"
          modifiers={[
            {
              name: "offset",
              enabled: true,
              options: {
                offset: [0, 12],
              },
            },
          ]}
        >
          <div className={styles.FiltersPopper}>
            <p className={styles.Title}>Search by:</p>
            <div className={styles.FiltersContainer}>
              <Controller
                name="filterBy"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    {filters.map((filter) => {
                      const Icon = filter.icon;
                      return (
                        <Checkbox
                          key={filter.value}
                          id={filter.value}
                          className={styles.Checkbox}
                          checked={value === filter.value}
                          onChange={() => onChange(filter.value)}
                          label={
                            <div className={styles.Label}>
                              {Icon && <Icon className={styles.Icon} />}{" "}
                              {filter.label}
                            </div>
                          }
                        />
                      );
                    })}
                  </>
                )}
              />
            </div>
          </div>
        </Popper>
      </form>

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
