import IPFS from "ipfs-core";

import logger from "../logger";

let node = null;

export function getIpfs() {
  return node;
}

export async function createIpfs() {
  try {
    node = await IPFS.create();

    const id = await node.id();
    const peers = await node.swarm.peers();

    logger("ipfs-id", `peer ID: ${JSON.stringify(id?.id)}`, "info");
    logger("ipfs-peers", `peers: ${JSON.stringify(peers)}`, "info");

    return true;
  } catch (error) {
    logger("ipfs-connection", error, "error");

    return false;
  }
}

export default node;
