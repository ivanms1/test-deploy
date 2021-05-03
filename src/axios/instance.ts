import axios from "axios";

import getAuthHeader from "../helpers/getAuthHeader";

import { PROD_DRIVE_SERVER, DEV_DRIVE_SERVER } from "../const";

const SERVER_URL =
  process.env.NODE_ENV === "development" ? DEV_DRIVE_SERVER : PROD_DRIVE_SERVER;

const instance = axios.create({
  baseURL: SERVER_URL,
  headers: {
    ["current-user"]: "67",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = getAuthHeader();

    if (token) {
      config.headers["current-user"] = token;
    } else {
      delete instance.defaults.headers["current-user"];
    }
    return config;
  },

  (error) => Promise.reject(error)
);

export default instance;
