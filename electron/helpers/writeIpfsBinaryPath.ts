import { app } from "electron";
import fs from "fs-extra";
import { join } from "path";

function writeIpfsBinaryPath(path) {
  fs.outputFileSync(
    join(app.getPath("home"), "./.ipfs-conun/IPFS_EXEC").replace(
      "app.asar",
      "app.asar.unpacked"
    ),
    path
  );
}

export default writeIpfsBinaryPath;
