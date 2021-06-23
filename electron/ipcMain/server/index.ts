import { ipcMain } from "electron";
import fetch from "electron-fetch";
import isDev from "electron-is-dev";
import FormData from "form-data";

import logger from "../../logger";
import db from "../../store/db";

import { DEV_DRIVE_SERVER, PROD_DRIVE_SERVER } from "../../const";

const SERVER_URL = isDev ? DEV_DRIVE_SERVER : PROD_DRIVE_SERVER;

ipcMain.handle("get-categories", async () => {
  try {
    const res = await fetch(`${SERVER_URL}/cate/get_all`, {
      method: "GET",
    });

    const data = await res.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    logger("get-categories", error?.message, "error");
    return {
      success: false,
      error,
    };
  }
});

ipcMain.handle("get-content-by", async (_, formData) => {
  try {
    const userDetails = await db.get("userDetailsDrive");

    const form = new FormData();

    await Promise.all([
      formData.forEach((e) => {
        form.append(e.name, e.value);
      }),
    ]);

    const res = await fetch(`${SERVER_URL}/content/get-contents-by`, {
      method: "POST",
      body: form,
      headers: {
        "current-user": userDetails?.userId,
      },
    });

    const data = await res.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    logger("get-content-by", error?.message, "error");
    return {
      success: false,
      error,
    };
  }
});

ipcMain.handle("get-downloads", async (_, { page = 1, limit = 10 }) => {
  try {
    const userDetails = await db.get("userDetailsDrive");

    const res = await fetch(
      `${SERVER_URL}/content/downloaded-by?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "current-user": userDetails?.userId,
        },
      }
    );

    const data = await res.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    logger("get-downloaded-by", error?.message, "error");
    return {
      success: false,
      error,
    };
  }
});

ipcMain.handle("update-user", async (_, formData) => {
  try {
    const userDetails = await db.get("userDetailsDrive");

    const form = new FormData();

    await Promise.all([
      formData.forEach((e) => {
        form.append(e.name, e.value);
      }),
    ]);

    const res = await fetch(`${SERVER_URL}/user/${userDetails?.userId}`, {
      method: "PUT",
      body: form,
    });

    const data = await res.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    logger("update-user", error?.message, "error");
    return {
      success: false,
      error,
    };
  }
});

ipcMain.handle(
  "search-content",
  async (_, { keyword, filter = "", page = 1, limit = 10 }) => {
    try {
      const userDetails = await db.get("userDetailsDrive");

      const res = await fetch(
        `${SERVER_URL}/search/content?keyword=${keyword}&filter=${filter}&page=${page}&limit${limit}`,
        {
          headers: {
            "current-user": userDetails?.userId,
          },
        }
      );

      const data = await res.json();

      return {
        success: true,
        data,
      };
    } catch (error) {
      logger("search-content", error?.message, "error");
      return {
        success: false,
        error,
      };
    }
  }
);

ipcMain.handle("search-content-autocomplete", async (_, value) => {
  try {
    const userDetails = await db.get("userDetailsDrive");

    const res = await fetch(
      `${SERVER_URL}/search/content/autocomplete?keyword=${value}`,
      {
        headers: {
          "current-user": userDetails?.userId,
        },
      }
    );

    const data = await res.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    logger("search-content-autocomplete", error?.message, "error");
    return {
      success: false,
      error,
    };
  }
});

ipcMain.handle("get-similar-content", async (_, id) => {
  try {
    const userDetails = await db.get("userDetailsDrive");

    const res = await fetch(`${SERVER_URL}/content/similar-contents/${id}`, {
      method: "GET",
      headers: {
        "current-user": userDetails?.userId,
      },
    });

    const data = await res.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    logger("get-similar-content", error?.message, "error");
    return {
      success: false,
      error,
    };
  }
});

ipcMain.handle("get-file", async (_, id) => {
  try {
    const userDetails = await db.get("userDetailsDrive");

    const res = await fetch(`${SERVER_URL}/content/${id}`, {
      method: "GET",
      headers: {
        "current-user": userDetails?.userId,
      },
    });

    const data = await res.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    logger("get-file", error?.message, "error");
    return {
      success: false,
      error,
    };
  }
});

ipcMain.handle("get-content-types", async () => {
  try {
    const userDetails = await db.get("userDetailsDrive");

    const res = await fetch(`${SERVER_URL}/content_type/get_all`, {
      method: "GET",
      headers: {
        "current-user": userDetails?.userId,
      },
    });

    const data = await res.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    logger("get-content-types", error?.message, "error");
    return {
      success: false,
      error,
    };
  }
});

ipcMain.handle("get-tags-autocomplete", async (_, value) => {
  try {
    const userDetails = await db.get("userDetailsDrive");

    const res = await fetch(
      `${SERVER_URL}/search/tag/autocomplete?tag=${value}`,
      {
        method: "GET",
        headers: {
          "current-user": userDetails?.userId,
        },
      }
    );

    const data = await res.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    logger("get-tags-autocomplete", error?.message, "error");
    return {
      success: false,
      error,
    };
  }
});
