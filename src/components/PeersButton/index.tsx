import React from "react";

import Button from "../Button";
import SmallSpinner from "../Spinner/SmallSpinner";

import useGetPeers from "../../hooks/useGetPeers";

import DotIcon from "../../assets/icons/dot.svg";

import styles from "./PeersButton.module.scss";

function PeersButton({ className }: { className: string }) {
  const { data: peers, refetch } = useGetPeers();
  return (
    <Button className={className} variant="grey" onClick={() => refetch()}>
      <DotIcon className={styles.DotIcon} />
      {peers && peers.length} Peers Online
    </Button>
  );
}

export default PeersButton;
