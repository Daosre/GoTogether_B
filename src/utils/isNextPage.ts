export function isNextPage(count: number, skip: number) {
  if (count > skip) {
    return true;
  } else {
    return false;
  }
}
