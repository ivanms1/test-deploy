/**
 * Returns boolean for 'rate is greater than 0.75', indicating a 'hot' item.
 * @param rate
 * @returns boolean
 */
export default function isHot(rate: number) {
  return rate >= 0.75;
}
