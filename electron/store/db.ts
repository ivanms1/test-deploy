import { app } from "electron";
import PouchDB from "pouchdb";

const db = new PouchDB(`${app.getPath("appData")}/conun-drive-db`);

export async function prepareDb() {
  try {
    await db.get("downloads");
  } catch {
    const newDownloads: any = {
      _id: "downloads",
      list: [],
    };
    await db.put(newDownloads);
  }

  try {
    await db.get("userDetailsDrive");
  } catch {
    const newUserDetails: any = {
      _id: "userDetailsDrive",
      walletAddress: null,
      userId: null,
      isIpfsFileNew: false,
    };
    await db.put(newUserDetails);
  }

  try {
    await db.get("savedForLaterList");
  } catch {
    const fallbackLaterList: any = {
      _id: "savedForLaterList",
      list: [],
    };
    await db.put(fallbackLaterList);
  }
}

export default db;
