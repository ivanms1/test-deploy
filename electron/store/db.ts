import { app } from "electron";
import PouchDB from "pouchdb";

const db = new PouchDB(`${app.getPath("appData")}/conun-drive-db`);

async function initDb() {
  const newDownloads: any = {
    _id: "downloads",
    list: [],
  };
  const newUserDetails: any = {
    _id: "userDetailsDrive",
    walletId: null,
    userId: null,
  };
  await db.put(newUserDetails);
  await db.put(newDownloads);

  return true;
}

export async function prepareDb() {
  try {
    await db.get("userDetailsDrive");
    await db.get("downloads");

    return true;
  } catch {
    return initDb();
  }
}

export default db;
