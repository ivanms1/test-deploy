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
      walletId: null,
      userId: null,
    };
    await db.put(newUserDetails);
  }
}

export default db;
