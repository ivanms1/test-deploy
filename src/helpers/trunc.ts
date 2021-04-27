/**
 * Shorten a string to a set length.
 * Returned string will be equal in length to the limit, or be unmodified.
 * @param hash string
 * @param limit number
 * @returns string
 */
export default function trunc(hash: string, limit: number) {
  if (hash.length > limit) {
    return hash.slice(0, limit - 3) + "...";
  } else {
    return hash;
  }
}
