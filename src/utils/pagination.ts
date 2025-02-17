import { isNumber } from 'class-validator';

export function pagination(page: number, take: number) {
  const skip = page * take;
  if (isNumber(skip) && Number(page) > 0) {
    return skip;
  } else {
    return 0;
  }
}
