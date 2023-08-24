export const DEFAULT_RANGE = 90;

export const VIEW_TYPE_JOURNALING = "image-memo";
export const VIEW_DISPLAY_TEXT = "IMemo Calendar";

export const EXTRACT_COLORS_OPTIONS = {
  pixels: 20000,
  distance: 0.2,
  saturationImportance: 0.2,
  splitPower: 10,
  colorValidator: (red: any, green: any, blue: any, alpha = 255) => alpha > 250,
};
export const EXTENSIONS = ["png", "jpg", "jpeg", "mp4"];

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
