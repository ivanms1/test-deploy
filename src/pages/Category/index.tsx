import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import { useParams } from "react-router";
import { Waypoint } from "react-waypoint";

import FileBox from "../../components/FileBox";
import Spinner from "../../components/Spinner";

import useUrlQuery from "../../hooks/useUrlQuery";

import instance from "../../axios/instance";

import { FileProps } from "../../types";

import styles from "./Category.module.scss";

const PAGE_LIMIT = 10;

function Category() {
  const { id } = useParams();

  const page = useRef(1);
  const total = useRef(0);

  const query = useUrlQuery();

  const {
    data: files,
    fetchNextPage,
    isLoading,
    remove,
  } = useInfiniteQuery(
    ["category", id],
    async ({ pageParam = page.current }) => {
      const formData = new FormData();
      formData.append("category_id", id);
      formData.append("order_by", "rate");
      formData.append("limit", String(PAGE_LIMIT));
      formData.append("page", pageParam);

      const { data } = await instance.post(
        "/content/get-contents-by",
        formData
      );
      total.current = data?.data?.total;
      page.current = page?.current + 1;

      return data.data;
    },
    {
      getNextPageParam() {
        if (page.current + 1 * PAGE_LIMIT < total.current) {
          return page.current;
        }
        return undefined;
      },
      enabled: !!id,
      refetchOnMount: "always",
    }
  );

  useEffect(() => {
    if (page.current !== 1) {
      remove();
      page.current = 1;
    }
  }, [id]);

  const categoryName = query.get("name");

  return (
    <div className={styles.Category}>
      <p className={styles.Title}>{categoryName}</p>
      <div className={styles.ResultsContainer}>
        {(files?.pages || []).map((group, i) => (
          <React.Fragment key={i}>
            {group?.data?.map((file: FileProps) => (
              <FileBox key={file.id} file={file} />
            ))}
          </React.Fragment>
        ))}
      </div>
      {isLoading && <Spinner />}
      {!isLoading && !files?.pages?.[0]?.data && (
        <p className={styles.NoResults}>No results</p>
      )}

      {!isLoading && (
        <Waypoint bottomOffset="-20%" onEnter={() => fetchNextPage()} />
      )}
    </div>
  );
}

export default Category;
