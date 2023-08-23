import { JournalingSettings } from "./types";

export const DEFAULT_RANGE = 90;

export const VIEW_TYPE_JOURNALING = "journaling";
export const VIEW_DISPLAY_TEXT = "Journaling Calendar";
export const TRIGGER_ON_OPEN = "calendar:open";
export const SETTINGS: JournalingSettings = {
  imgDataFolder: null,
  galleryLoadPath: "/",
  width: 400,
  reverseDisplay: true,
};
export const EXTRACT_COLORS_OPTIONS = {
  pixels: 20000,
  distance: 0.2,
  saturationImportance: 0.2,
  splitPower: 10,
  colorValidator: (red: any, green: any, blue: any, alpha = 255) => alpha > 250,
};
export const EXTENSIONS = ["png", "jpg", "jpeg", "mp4"];
export const VIDEO_REGEX = new RegExp(".*\\.mp4\\?\\d*$");
export const OB_GALLERY = "ob-gallery";
export const OB_GALLERY_INFO = "ob-gallery-info";
export const galleryIcon = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="images" class="svg-inline--fa fa-images fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v208c0 44.112 35.888 80 80 80h336zm96-80V80c0-26.51-21.49-48-48-48H144c-26.51 0-48 21.49-48 48v256c0 26.51 21.49 48 48 48h384c26.51 0 48-21.49 48-48zM256 128c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-96 144l55.515-55.515c4.686-4.686 12.284-4.686 16.971 0L272 256l135.515-135.515c4.686-4.686 12.284-4.686 16.971 0L512 208v112H160v-48z"></path></svg>`;
export const gallerySearchIcon = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" class="svg-inline--fa fa-search fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>`;

export const PLUGIN_MARKDOWN_USAGE = `
e.g. Input:

\`\`\`
![](xxx.jpg) (can be pasted as local or remote image)
name=IMAGE NAME
type=art
rating=3
#tag1 #tag2
\`\`\`

----

Please Check Release Notes for plugin changes:<br>
https://github.com/Ender-Wiggin2019/obsidian-journaling
`;

export const GALLERY_RESOURCES_MISSING = `
<div class="gallery-resources-alert">
  <strong>Missing or Unspecified Image Information Resources folder</strong>
</div>

Please make sure that a Valid Folder is specified in the settings for the plugin to use to store image information notes!
`;
