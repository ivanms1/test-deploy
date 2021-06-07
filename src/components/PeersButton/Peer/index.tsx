import React from "react";
import axios from "axios";
import { useQuery } from "react-query";

import Unknown from "../../../assets/icons/unknown.svg";

import styles from "./Peer.module.scss";

const regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;

function ipExtractor(addr: string) {
  return addr.match(regex);
}

function Peer({ peer }) {
  const { data } = useQuery(["peer", peer.addr], async () => {
    const { data } = await axios.get(
      `https://get.geojs.io/v1/ip/country/${ipExtractor(peer.addr)}`
    );

    return data;
  });

  return (
    <div className={styles.Peer}>
      <div className={styles.FlagContainer}>
        {data && data.trim() !== "nil" ? (
          <img
            className={styles.Flag}
            src={`https://www.countryflags.io/${data}/flat/64.png`}
          />
        ) : (
          <Unknown className={styles.Flag} />
        )}
      </div>
      <p>{peer.peer}</p>
    </div>
  );
}

export default Peer;
