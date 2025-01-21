export function isNextPage(count: number, skip: number) {
  // console.log(count, skip);
  if (count > skip) {
    return true;
  } else {
    return false;
  }
}
