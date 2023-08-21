import { TFile } from "obsidian";
import type { Moment } from "moment";
import type { IGranularity } from "obsidian-daily-notes-interface";

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

export interface IJournalingImage {
  name: string; // the image name
  imageLink: ImageLink;
  path: string; // the image path
  extension: string; // the image extension (jpg, png, etc.)
  size: number; // the image size in MB
  dimensions: HTMLImageElement | null; // width and height of the image
  date: string; // the image date
  tagList: string[]; // the image tags
  colorList: { hex: string }[]; // the image colors
  description?: string; // the image description
  showDescription?: boolean; // whether to show the image description
  imageType?: ImageType; // the image type (screenshot, photo, etc.)
  infoList?: string[];
}

export enum ImageType {
  DEFAULT = "default",
  ART = "art",
  PHOTO = "photo",
}

export interface IDot {
  isFilled: boolean;
}

export interface IWeek {
  days: Moment[];
  weekNum: number;
}

export type IMonth = IWeek[];

export type IHTMLAttributes = Record<string, string | number | boolean>;

export interface IEvaluatedMetadata {
  value: number | string;
  goal?: number;
  dots: IDot[];
  attrs?: IHTMLAttributes;
}

export type ISourceDisplayOption = "calendar-and-menu" | "menu" | "none";

export interface ISourceSettings {
  color: string;
  display: ISourceDisplayOption;
  order: number;
}

export interface IDayMetadata
  extends ICalendarSource,
    ISourceSettings,
    IEvaluatedMetadata {}

export interface ICalendarSource {
  id: string;
  name: string;
  description?: string;

  getMetadata?: (
    granularity: IGranularity,
    date: Moment,
    file: TFile
  ) => Promise<IEvaluatedMetadata>;

  defaultSettings: Record<string, string | number>;
  registerSettings?: (
    containerEl: HTMLElement,
    settings: ISourceSettings,
    saveSettings: (settings: Partial<ISourceSettings>) => void
  ) => void;
}

export type ImageLink = {
  type: "local" | "external";
  link: string;
};
// | {
// 	type: 'placeholder';
// }

export interface JournalingSettings {
  imgDataFolder: string;
  galleryLoadPath: string;
  width: number;
  reverseDisplay: boolean;
}

export interface ImageResources {
  [key: string]: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface GalleryBlockArgs {
  type: string;
  path: string;
  name: string;
  imgWidth: number;
  divWidth: number;
  divAlign: string;
  reverseOrder: string;
  customList: string;
}

export interface InfoBlockArgs {
  imgPath: string;
  ignoreInfo: string;
}

/**
 * Return initial img info file content
 * @param imgPath - Relative vault path of related image
 */
// const initializeInfo = (imgPath: string, imgName: string): string => {
//   return `<span class='gallery-span-info'> [[${imgName}]] </span>\n
// %% Place Tags Here %%
// \`\`\`gallery-info
// imgPath=${imgPath}
// \`\`\`
// `;
// };
