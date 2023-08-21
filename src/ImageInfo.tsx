import type { Vault, MetadataCache, WorkspaceLeaf } from "obsidian";
import { MarkdownRenderer, TFile, getAllTags } from "obsidian";
import JournalingPlugin from "./main";
import { extractColors } from "extract-colors";
import { IJournalingImage, ImageType } from "./types";
import JournalingImage, {
  GalleryInfoProps,
} from "./components/JournalingImage";
import React from "react";
import { createRoot } from "react-dom/client";
import { getImages } from "./source_process/GetImages";
import { AppContext } from "./utils/AppContext";
import { getTags } from "./source_process/GetTags";
import { Badge } from "./ui/badge";
import {
  EXTENSIONS,
  EXTRACT_COLORS_OPTIONS,
  OB_GALLERY_INFO,
} from "./constants";
import { PluginContext } from "./utils/pluginContext";

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

  // init
  const props: IJournalingImage = {
    name: "",
    imageLink: { type: "local", link: "" },
    path: "",
    extension: "",
    size: 0,
    dimensions: null,
    date: "",
    tagList: [],
    colorList: [],
    description: "",
    showDescription: true,
    imageType: ImageType.DEFAULT,
    infoList: [],
  };

  // get the arguments
  source.split("\n").map((line) => {
    if (line && line.indexOf("=") > 0) {
      const param = line.trim().split("=");
      const key = param[0].trim();
      let value = param[1]?.trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      if (key === "show") {
        props["showDescription"] = value === "true";
      } else if (key === "desc") {
        props["description"] = value;
      } else if (key === "type") {
        const imageType = Object.values(ImageType).some(
          (type) => type === value.toLowerCase()
        )
          ? (value.toLowerCase() as ImageType)
          : ImageType.DEFAULT;
        props["imageType"] = imageType;
      } else {
        // props[key] = value;
        // TODO: should add some setting for date
      }
    }
  });

  // const infoList = args.ignoreInfo
  //   .split(";")
  //   .map((param) => param.trim().toLowerCase())
  //   .filter((e) => e !== "");
  // const imgName = images[0].link.split("/").slice(-1)[0];
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

  if (imgTFile instanceof TFile && EXTENSIONS.contains(imgTFile.extension)) {
    // const props: GalleryInfoProps = {
    //   name: imgTFile.basename,
    //   path: imgTFile.path,
    //   extension: imgTFile.extension,
    //   date: new Date(imgTFile.stat.ctime).toString(),
    //   dimensions: measureEl,
    //   size: imgTFile.stat.size / 1000000,
    //   colorList: colors,
    //   tagList: tags,
    // 	description?: string; // the image description
    // 	showDescription?: boolean; // whether to show the image description
    // 	imageType?: ImageType; // the image type (screenshot, photo, etc.)
    //   infoList: infoList,
    // };
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

    // update props
    props.name = imgTFile.basename;
    props.imageLink = images[0];
    props.path = imgTFile.path;
    props.extension = imgTFile.extension;
    props.date = new Date(imgTFile.stat.ctime).toString();
    props.dimensions = measureEl;
    props.size = imgTFile.stat.size / 1000000;
    props.colorList = colors;
    props.tagList = tags;
    console.log("images", images);

    const uniqueKey = images[0].link + tags.join("-");

    // 在root上渲染React组件
    root.render(
      <AppContext.Provider value={this.app}>
        <PluginContext.Provider value={plugin}>
          <div key={uniqueKey}>
            {/*<ImageDisplay image={images[0]}/>*/}
            <JournalingImage {...props} />
            {/*<ImageDisplay image={images[0]} plugin={plugin} />*/}
            {/*{tags.map((tag, index) => (*/}
            {/*  <Badge key={index} className="bg-zinc-800 text-zinc-50">*/}
            {/*    {tag}*/}
            {/*  </Badge>*/}
            {/*))}*/}
          </div>
        </PluginContext.Provider>
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
      // const infoView = workspace.getLeavesOfType(OB_GALLERY_INFO)[0]?.view;
      // TODO
      // if (infoView instanceof GalleryInfoView) {
      // 	infoView.infoFile = imgInfo;
      // 	infoView.editor.setValue(await vault.cachedRead(imgInfo));
      // 	infoView.render();
      // }
    }
  });
}
