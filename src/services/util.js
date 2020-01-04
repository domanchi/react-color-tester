/**
 * Math.floor with precision.
 * @param {number} number 
 * @param {number} decimals 
 */
export function floor(number, decimals) {
  decimals = +decimals || 0;

  const multiplier = Math.pow(10, decimals);
  return Math.floor(number * multiplier) / multiplier;
}