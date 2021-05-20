import React from "react";
import classNames from "classnames";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ScrollContainer from "react-indiana-drag-scroll";

import Tooltip from "../../Tooltip";
import Button from "../../Button";
import DownloadQueue from "./DownloadQueue";

import { useAppContext } from "../../AppContext";
import useCurrentUser from "../../../hooks/useCurrentUser";
import useGetImage from "../../../hooks/useGetImage";

import ConunLogo from "../../../assets/icons/conun.svg";
import DotIcon from "../../../assets/icons/dot.svg";
import Arrow from "../../../assets/icons/next.svg";
import NoAvatar from "../../../assets/icons/no-avatar.svg";

import styles from "./DownloadSidebar.module.scss";

const { api } = window;

const variants = {
  open: { x: 0 },
  closed: { x: -180 },
};

function FilesSidebar() {
  const { isDownloadsOpen, isManagerConnected, handleDownloadSidebar } =
    useAppContext();

  const { currentUser } = useCurrentUser();

  const { data: avatarImgSrc } = useGetImage(currentUser?.avatar);

  return (
    <motion.div
      className={styles.DownloadSidebar}
      initial="closed"
      animate={isDownloadsOpen ? "open" : "closed"}
      variants={variants}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className={styles.LogoSection}>
        <ConunLogo className={styles.ConunLogo} />
        <Tooltip id="manager-check">
          <Button
            type="button"
            data-for="manager-check"
            data-tip={
              isManagerConnected
                ? "Manager is connected!"
                : "Sign into the manager and click here to reconnect"
            }
            className={styles.ManagerButton}
            onClick={() => (isManagerConnected ? {} : api.connectToManager())}
            variant="grey"
          >
            <DotIcon
              className={classNames(styles.DotIcon, {
                [styles.online]: isManagerConnected,
              })}
            />
            Manager {isManagerConnected ? "Online" : "Offline"}{" "}
          </Button>
        </Tooltip>
      </div>
      {currentUser && (
        <Link
          className={styles.UserPicture}
          to={`/user-details?user=${currentUser?.id}&walletHash=${currentUser?.wallet_id}&avatar=${currentUser?.avatar}`}
        >
          {avatarImgSrc ? (
            <img
              className={styles.Picture}
              src={avatarImgSrc}
              alt="user profile"
            />
          ) : (
            <NoAvatar className={styles.Picture} />
          )}
        </Link>
      )}

      <ScrollContainer className={styles.WalletAddressContainer}>
        <Tooltip id="side-bar-address">
          <button
            className={styles.WalletAddress}
            onClick={() =>
              navigator.clipboard.writeText(currentUser?.wallet_id)
            }
            data-for="side-bar-address"
            data-tip="Click to copy address"
          >
            {currentUser?.wallet_id}
          </button>
        </Tooltip>
      </ScrollContainer>

      <DownloadQueue />

      <motion.button
        animate={isDownloadsOpen ? "open" : "closed"}
        variants={{
          open: { rotateY: -180 },
          closed: { rotateY: 0 },
        }}
        className={styles.ArrowButton}
        onClick={() => handleDownloadSidebar(!isDownloadsOpen)}
      >
        <Arrow className={classNames(styles.Arrow)} />
      </motion.button>
    </motion.div>
  );
}

export default FilesSidebar;
