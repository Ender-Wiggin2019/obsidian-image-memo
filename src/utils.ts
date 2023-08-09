import type { DataAdapter, Vault, MetadataCache } from "obsidian";
import { TFolder, TFile } from "obsidian";
import type GalleryPlugin from "./main";
import { EXTENSIONS, ImageResources } from "./types";
/**
 * Return initial img info file content
 * @param imgPath - Relative vault path of related image
 */
const initializeInfo = (imgPath: string, imgName: string): string => {
  return `<span class='gallery-span-info'> [[${imgName}]] </span>\n
%% Place Tags Here %%
\`\`\`gallery-info
imgPath=${imgPath}
\`\`\`
`;
};

/**
 * Return Image Info File, if not present create it
 * @param imgPath - Obsidian Vault Image relative path
 * @param vault - Vault handler
 * @param metadata - Vaulat metadata handler
 * @param plugin - Gallery plugin handler
 * @param create
 */

export const getImgInfo = async (
  imgPath: string,
  vault: Vault,
  metadata: MetadataCache,
  plugin: GalleryPlugin,
  create: boolean
): Promise<TFile> => {
  let infoFile = null;
  let imgName = imgPath.split("/").slice(-1)[0];
  // let infoFolder = vault.getAbstractFileByPath(plugin.settings.imgDataFolder);
  let infoFolder = vault.getAbstractFileByPath("resources/gallery");

  console.log("infoFolder", infoFolder);
  let infoFileList: string[] = [];
  if (infoFolder instanceof TFolder) {
    infoFolder.children?.forEach((info) => {
      if (info instanceof TFile) {
        infoFileList.push(info.basename);
        metadata.getFileCache(info)?.links?.forEach((link) => {
          if (link.link === imgName || link.link === imgPath) {
            infoFile = info;
          }
        });
      }
    });
    console.log("infoFile", infoFile);
    if (!infoFile && create) {
      // Info File does not exist, Create it
      // await plugin.saveSettings();
      let counter = 1;
      let fileName = imgName.split(".")[0];
      while (infoFileList.contains(fileName)) {
        fileName = `${fileName}_${counter}`;
        counter++;
      }

      await vault.adapter.write(
        `${plugin.settings.imgDataFolder}/${fileName}.md`,
        initializeInfo(imgPath, imgName)
      );
      infoFile = vault.getAbstractFileByPath(
        `${plugin.settings.imgDataFolder}/${fileName}.md`
      ) as TFile;
    }
    return infoFile;
  }

  // Specified Resources folder does not exist
  return null;
};

/**
 * Return images in the specified directory
 * @param path - path to project e.g. 'Test Project/First Sub Project'
 * @param name - image name to filter by
 * @param vaultFiles - list of all TFiles of Obsidian vault
 * @param handler - Obsidian vault handler
 */

export const getImageResources = (
  path: string,
  name: string,
  vaultFiles: TFile[],
  handler: DataAdapter
): ImageResources => {
  let imgList: ImageResources = {};

  let reg;
  try {
    reg = new RegExp(`^${path}.*${name}.*$`);
    if (path === "/") {
      reg = new RegExp(`^.*${name}.*$`);
    }
  } catch (error) {
    console.log("Gallery Search - BAD REGEX! regex set to `.*` as default!!");
    reg = ".*";
  }

  for (let file of vaultFiles) {
    if (
      EXTENSIONS.contains(file.extension.toLowerCase()) &&
      file.path.match(reg)
    ) {
      imgList[handler.getResourcePath(file.path)] = file.path;
    }
  }
  return imgList;
};

export const updateFocus = (
  imgEl: HTMLImageElement,
  videoEl: HTMLVideoElement,
  src: string,
  isVideo: boolean
): void => {
  if (isVideo) {
    // hide focus image div
    imgEl.style.setProperty("display", "none");
    // Show focus video div
    videoEl.style.setProperty("display", "block");
    // Clear Focus image
    imgEl.src = "";
    // Set focus video
    videoEl.src = src;
    return;
  }

  // Show focus image div
  imgEl.style.setProperty("display", "block");
  // Hide focus video div
  videoEl.style.setProperty("display", "none");
  // Clear Focus video
  videoEl.src = "";
  // Set focus image
  imgEl.src = src;
};
