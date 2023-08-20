import type { Vault, MetadataCache, WorkspaceLeaf } from "obsidian";
import { MarkdownRenderer, TFile, getAllTags } from "obsidian";
import JournalingPlugin from "./main";
import { extractColors } from "extract-colors";
import { InfoBlockArgs } from "./types";
import GalleryInfo, { GalleryInfoProps } from "./components/GalleryInfo";
import { getImageResources, getImgInfo } from "./utils";
import React from "react";
import { createRoot } from "react-dom/client";
import DiceRoller from "./components/DicerRoller";
import ReactDOM from "react-dom";
import { getImages } from "./source_process/GetImages";
import { AppContext } from "./utils/AppContext";
import { ImageDisplay } from "./components/ImageDisplay";
import { getTags } from "./source_process/GetTags";
import { Badge } from "./ui/badge";
import {
  EXTENSIONS,
  EXTRACT_COLORS_OPTIONS,
  GALLERY_INFO_USAGE,
  OB_GALLERY_INFO,
  VIDEO_REGEX,
} from "./constants";

export async function imageInfo(
  source: string,
  el: HTMLElement,
  vault: Vault,
  metadata: MetadataCache,
  plugin: JournalingPlugin
) {
  // Get all images
  const images = getImages(source);
  const tags = getTags(source);

  const args: InfoBlockArgs = {
    imgPath: "",
    ignoreInfo: "",
  };

  // get the arguments
  source.split("\n").map((e) => {
    if (e) {
      const param = e.trim().split("=");
      (args as any)[param[0]] = param[1]?.trim();
    }
  });

  const infoList = args.ignoreInfo
    .split(";")
    .map((param) => param.trim().toLowerCase())
    .filter((e) => e !== "");
  const imgName = images[0].link.split("/").slice(-1)[0];
  const elCanvas = el.createDiv({
    cls: "ob-gallery-info-block",
    attr: { style: `width: 100%; height: auto; float: left` },
  });

  // let imgTFile = vault.getAbstractFileByPath(args.imgPath);
  const imgTFile = vault.getAbstractFileByPath(images[0].link);
  const imgURL = vault.adapter.getResourcePath(images[0].link);

  // Handle problematic arg
  // if (!args.imgPath || !imgTFile) {
  // 	MarkdownRenderer.renderMarkdown(GALLERY_INFO_USAGE, elCanvas, '/', plugin);
  // 	return;
  // }
  // Get image dimensions
  // if (imgURL.match(VIDEO_REGEX)) {
  // 	measureEl = document.createElement('video');
  // 	isVideo = true;
  // } else {
  // 	measureEl = new Image();
  // 	colors = await extractColors(imgURL, EXTRACT_COLORS_OPTIONS);
  // 	isVideo = false;
  // }
  // TODO: 只有图片格式
  const measureEl = new Image();
  const colors = await extractColors(imgURL, EXTRACT_COLORS_OPTIONS);

  measureEl.src = imgURL;

  // Handle disabled img info functionality or missing info block
  // let imgInfo = await getImgInfo(imgTFile.path, vault, metadata, plugin, false);
  // const imgTags = null;

  // const imgLinks: { path: string; name: string }[] = [];
  // get all files!
  console.log("length", vault.getMarkdownFiles().length);
  vault.getMarkdownFiles().forEach((mdFile) => {
    // metadata.getFileCache(mdFile)?.links?.forEach((link) => {
    // 	console.log('block', link.blocks);
    //   // if (link.link === args.imgPath || link.link === imgName) {
    //   //   imgLinks.push({ path: mdFile.path, name: mdFile.basename });
    //   // }
    // });
    console.log("test", metadata.getFileCache(mdFile)?.blocks ?? "");
  });

  console.log(
    "imgTFile",
    imgTFile,
    imgTFile instanceof TFile && EXTENSIONS.contains(imgTFile.extension)
  );
  if (imgTFile instanceof TFile && EXTENSIONS.contains(imgTFile.extension)) {
    const props: GalleryInfoProps = {
      name: imgTFile.basename,
      path: imgTFile.path,
      extension: imgTFile.extension,
      date: new Date(imgTFile.stat.ctime).toString(),
      dimensions: measureEl,
      size: imgTFile.stat.size / 1000000,
      colorList: colors,
      tagList: tags,
      // isVideo: isVideo,
      // imgLinks: imgLinks,
      // frontmatter: imgInfoCache.frontmatter,
      infoList: infoList,
    };
    // const reactComponent = React.createElement(GalleryInfo, props);
    //
    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // ReactDOM.render(reactComponent, elCanvas);

    const root = createRoot(elCanvas);

    // TODO: TEST

    // const imgResources = getImageResources(imgTFile.path,
    // 	imgTFile.basename,
    // 	this.app.vault.getFiles(),
    // 	this.app.vault.adapter);
    //
    // console.log('Object.keys(imgResources)[0]', Object.keys(imgResources)[0]);
    const images = getImages(source);
    console.log("images", images);

    const uniqueKey = images[0].link + tags.join("-");

    // 在root上渲染React组件
    root.render(
      <AppContext.Provider value={this.app}>
        <div key={uniqueKey}>
          <GalleryInfo {...props} />
          <ImageDisplay image={images[0]} plugin={plugin} />
          {tags.map((tag, index) => (
            <Badge key={index} className="bg-zinc-800 text-zinc-50">
              {tag}
            </Badge>
          ))}
        </div>
      </AppContext.Provider>
    );

    // new GalleryInfo({
    // 	props: {
    // 		name: imgTFile.basename,
    // 		path: imgTFile.path,
    // 		extension: imgTFile.extension,
    // 		date: new Date(imgTFile.stat.ctime),
    // 		dimensions: measureEl,
    // 		size: imgTFile.stat.size / 1000000,
    // 		colorList: colors,
    // 		tagList: imgTags,
    // 		isVideo: isVideo,
    // 		imgLinks: imgLinks,
    // 		frontmatter: imgInfoCache.frontmatter,
    // 		infoList: infoList
    // 	},
    // 	target: elCanvas
    // });
  }

  elCanvas.onClickEvent(async (event) => {
    if (event.button === 2) {
      // Open image info view in side panel
      const workspace = plugin.app.workspace;
      workspace.detachLeavesOfType(OB_GALLERY_INFO);
      await workspace
        .getRightLeaf(false)
        .setViewState({ type: OB_GALLERY_INFO });
      workspace.revealLeaf(await workspace.getLeavesOfType(OB_GALLERY_INFO)[0]);
      const infoView = workspace.getLeavesOfType(OB_GALLERY_INFO)[0]?.view;
      // TODO
      // if (infoView instanceof GalleryInfoView) {
      // 	infoView.infoFile = imgInfo;
      // 	infoView.editor.setValue(await vault.cachedRead(imgInfo));
      // 	infoView.render();
      // }
    }
  });
}
