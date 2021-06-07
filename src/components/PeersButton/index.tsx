import React from "react";

import Popper from "../Popper";
import Peer from "./Peer";

import useGetPeers from "../../hooks/useGetPeers";

import DotIcon from "../../assets/icons/dot.svg";

import styles from "./PeersButton.module.scss";

function PeersButton() {
  const { data: peers, refetch } = useGetPeers();

  return (
    <Popper
      placement="bottom-start"
      onClick={() => refetch()}
      manager={
        <div className={styles.PeersButton}>
          <DotIcon className={styles.DotIcon} />
          {peers?.length ?? 0} Peers Online
        </div>
      }
      modifiers={[
        {
          name: "offset",
          enabled: true,
          options: {
            offset: [-150, 12],
          },
        },
      ]}
    >
      <div className={styles.PeersPopper}>
        <div className={styles.PeersContainer}>
          <div className={styles.HeaderRow}>
            <p className={styles.Header}>Location</p>
            <p className={styles.Header}>Peer ID</p>
          </div>
          {peers?.map((peer, index) => (
            <Peer key={`${peer.addr}_${index}`} peer={peer} />
          ))}
        </div>
      </div>
    </Popper>
  );
}

export default PeersButton;
