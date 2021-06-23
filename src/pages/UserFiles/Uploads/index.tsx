import React, { useRef } from "react";
import { useInfiniteQuery } from "react-query";
import { useHistory, useParams } from "react-router";
import { Waypoint } from "react-waypoint";

import Button from "../../../components/Button";
import Cell from "../Cell";
import Spinner from "../../../components/Spinner";

import BackIcon from "../../../assets/icons/back.svg";

import { FileProps } from "../../../types";

import styles from "./Uploads.module.scss";
import { motion } from "framer-motion";
import { mainPageAnimation } from "../../../anim";

const { api } = window;

const PAGE_LIMIT = 18;

function BackButton() {
  const history = useHistory();
  return (
    <div className={styles.BackButton}>
      <Button noStyle onClick={() => history.goBack()}>
        <BackIcon className={styles.Icon} />
      </Button>
    </div>
  );
}

function Uploads() {
  const page = useRef(1);
  const total = useRef(0);

  const { id: authorID } = useParams();

  const {
    data: files,
    fetchNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["user_uploads", authorID],
    async ({ pageParam = page.current }) => {
      const { data } = await api.getContentBy([
        { name: "user_id", value: authorID },
        { name: "order_by", value: "rate" },
        { name: "limit", value: String(PAGE_LIMIT) },
        { name: "page", value: pageParam },
      ]);
      total.current = data?.data?.total;
      page.current = page?.current + 1;
      return data.data;
    },
    {
      getNextPageParam() {
        if ((page.current - 1) * PAGE_LIMIT < total.current) {
          return page.current;
        }

        return undefined;
      },
      enabled: !!authorID,
      refetchOnMount: "always",
    }
  );

  return (
    <motion.div
      className={styles.Background}
      variants={mainPageAnimation}
      initial="exit"
      animate="enter"
      exit="exit"
    >
      <BackButton />
      <div className={styles.Layout}>
        <div className={styles.Title}>Uploads</div>
        <div className={styles.ResultsTable}>
          {(files?.pages || []).map((group, i) => (
            <React.Fragment key={i}>
              {group?.data?.map((file: FileProps) => (
                <Cell key={file.id} file={file} />
              ))}
            </React.Fragment>
          ))}
          {!isLoading && (
            <Waypoint bottomOffset="-20%" onEnter={() => fetchNextPage()} />
          )}
        </div>
        {!isLoading && !files?.pages?.[0]?.data && (
          <div className={styles.NoResults}>No results</div>
        )}
      </div>
      {isLoading && (
        <div className={styles.Spinner}>
          <Spinner />
        </div>
      )}
    </motion.div>
  );
}

export default Uploads;
