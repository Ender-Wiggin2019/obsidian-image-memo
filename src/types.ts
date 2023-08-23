import type { Moment } from "moment";

export interface IJournalingDailyTag {
  tag: string;
  count: number;
  images: string[];
}

export interface IJournalingData {
  date: Moment;
  dailyTags: IJournalingDailyTag[];
}

export interface IJournalingDailyImages {
  date: Moment;
  count: number;
  images: string[];
}

export interface IJournalingTags {
  tag: string;
  dates: IJournalingDailyImages[];
}

export interface ICalendarEntry {
  count: number;
  date: string;
  level: number;
}

export interface IJournalingImage {
  name: string; // the image name
  imageLink: ImageLink;
  path: string; // the image path
  extension: string; // the image extension (jpg, png, etc.)
  size?: number; // the image size in MB
  dimensions: HTMLImageElement | null; // width and height of the image
  date?: string; // the image date
  tagList: string[]; // the image tags
  colorList: { hex: string }[]; // the image colors
  rating?: number; // the image rating
  description?: string; // the image description
  showImage?: boolean; // whether to show the image
  showDescription?: boolean; // whether to show the image description
  imageType?: ImageType; // the image type (screenshot, photo, etc.)
  notShow?: string[]; // determines whether to show the labels
}

export enum ImageType {
  DEFAULT = "default",
  ART = "art",
  PHOTO = "photo",
  REVIEW = "review",
}

export interface IWeek {
  days: Moment[];
  weekNum: number;
}

export type ISourceDisplayOption = "calendar-and-menu" | "menu" | "none";

export type ImageLink = {
  type: "local" | "external";
  link: string;
};
