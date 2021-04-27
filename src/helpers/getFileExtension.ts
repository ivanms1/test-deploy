/**
 * Given a string of a file, returns substring following the last .
 * @param fileName string
 * @returns string
 */
function getFileExtension(fileName: string) {
  return fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);
}

export default getFileExtension;
