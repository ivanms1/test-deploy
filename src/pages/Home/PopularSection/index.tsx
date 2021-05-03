import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

import Category from "./Category";

import instance from "../../../axios/instance";

import styles from "./PopularSection.module.scss";

function PopularSection() {
  const { data } = useQuery("get-all-categories", async () => {
    const { data } = await instance.get("/cate/get_all");

    return data;
  });

  return (
    <div className={styles.PopularSection}>
      {data?.data?.map((category) => (
        <div key={category.id} className={styles.Section}>
          <p className={styles.Title}>
            Popular in{" "}
            <Link
              className={styles.CategoryLink}
              to={`/category/${category.id}?name=${category.name}`}
            >
              {category?.name}
            </Link>
          </p>
          <Category categoryId={category.id} />
        </div>
      ))}
    </div>
  );
}

export default PopularSection;
