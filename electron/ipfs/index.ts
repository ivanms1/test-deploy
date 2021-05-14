import { app } from "electron";
import IPFS from "ipfs-core";
import fs from "fs-extra";
import { join } from "path";

import logger from "../logger";
import db from "../store/db";

let node = null;

export function getIpfs() {
  return node;
}

export async function createIpfs() {
  try {
    const userDetails = await db.get("userDetailsDrive");

    if (app.getVersion() === "0.1.2-beta" && !userDetails?.isIpfsFileNew) {
      logger("ipfs-id", "removing .jsipfs folder", "info");

      fs.removeSync(join(app.getPath("home"), ".jsipfs"));

      logger("ipfs-id", "removed .jsipfs folder", "info");

      await db.put({
        ...userDetails,
        isIpfsFileNew: true,
      });
    }

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
