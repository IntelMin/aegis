export function formatAddress(str: string): string {
  let formattedStr = `${str.substring(0, 8)}...${str.substring(
    str.length - 5
  )}`;
  return formattedStr;
}
