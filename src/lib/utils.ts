import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment, { Moment } from "moment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateDateRange(
  startDate: string,
  endDate: string
): Moment[] {
  const start = moment(startDate);
  const end = moment(endDate);
  const dateArray: Moment[] = [];

  while (start.isBefore(end) || start.isSame(end)) {
    dateArray.push(start.clone()); // 使用.clone()以确保我们每次都存储新的Moment实例
    start.add(1, "days");
  }

  return dateArray;
}
