function getIpfsBinPath() {
  return require("go-ipfs").path().replace("app.asar", "app.asar.unpacked");
}

export default getIpfsBinPath;
