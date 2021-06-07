import React from "react";
import { Controller } from "react-hook-form";

import Popper from "../../../../Popper";
import Checkbox from "../../../../Form/Checkbox";

import styles from "./Filters.module.scss";

function Filters({ control, filters, currentFilter }) {
  const Icon = currentFilter.icon;
  return (
    <Popper
      manager={<Icon className={styles.SettingsIcon} />}
      placement="bottom-start"
      modifiers={[
        {
          name: "offset",
          enabled: true,
          options: {
            offset: [-105, 17],
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
  );
}

export default Filters;
