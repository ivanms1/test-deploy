import { app } from "electron";
import fs from "fs-extra";
import { join } from "path";

function writeIpfsPath(path) {
  fs.outputFileSync(
    join(app.getPath("home"), "./.ipfs-conun/IPFS_PATH").replace(
      "app.asar",
      "app.asar.unpacked"
    ),
    path
  );
}

export default writeIpfsPath;
