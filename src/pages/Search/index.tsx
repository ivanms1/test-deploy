import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import { useLocation } from "react-router";
import { Waypoint } from "react-waypoint";

import FileBox from "../../components/FileBox";
import Spinner from "../../components/Spinner";

import useUrlQuery from "../../hooks/useUrlQuery";

import instance from "../../axios/instance";

import { FileProps } from "../../types";

import styles from "./Search.module.scss";

const PAGE_LIMIT = 10;

function Search() {
  const location = useLocation();
  const query = useUrlQuery();

  const page = useRef(Number(query.get("page")));
  const total = useRef(0);

  const {
    data: files,
    fetchNextPage,
    remove,
    isLoading,
  } = useInfiniteQuery(
    ["search", query.get("keyword"), query.get("filter")],
    async ({ pageParam = page.current }) => {
      const { data } = await instance.get(
        `/search/content?keyword=${query.get("keyword")}&filter=${query.get(
          "filter"
        )}&page=${pageParam}`
      );

      total.current = data?.data?.total;
      page.current = page?.current + 1;
      return data.data;
    },
    {
      getNextPageParam() {
        if (page.current * PAGE_LIMIT < total.current) {
          return page.current;
        }
        return undefined;
      },
      enabled: !!query.get("keyword") && page.current === 1,
    }
  );

  useEffect(() => {
    if (page.current !== 1) {
      remove();
      page.current = 1;
    }
  }, [location.search]);

  return (
    <div className={styles.Search}>
      <p className={styles.Title}>Results</p>
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

export default Search;
