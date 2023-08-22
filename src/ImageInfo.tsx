import type { MetadataCache, Vault } from "obsidian";
import { MarkdownRenderer, TFile } from "obsidian";
import JournalingPlugin from "./main";
import { extractColors } from "extract-colors";
import { IJournalingImage, ImageType } from "./types";
import JournalingImage from "./components/JournalingImage";
import React from "react";
import { createRoot } from "react-dom/client";
import { getImages } from "./source_process/GetImages";
import { AppContext } from "./utils/AppContext";
import { getTags } from "./source_process/GetTags";
import {
  EXTENSIONS,
  EXTRACT_COLORS_OPTIONS,
  OB_GALLERY_INFO,
  PLUGIN_MARKDOWN_USAGE,
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
  const currentImage = images[0];
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
    rating: 0,
    description: "",
    showDescription: true,
    imageType: ImageType.DEFAULT,
    showList: [],
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
      } else if (key === "name") {
        props["name"] = value;
      } else if (key === "rating") {
        props["rating"] = parseInt(value);
      } else if (key === "type") {
        // get imageType from the enum ImageType
        props["imageType"] = Object.values(ImageType).some(
          (type) => type === value.toLowerCase()
        )
          ? (value.toLowerCase() as ImageType)
          : ImageType.DEFAULT;
      } else if (key === "showList") {
        props["showList"] = value.split(",");
      } else {
        // props[key] = value;
        // TODO: should add some setting for date
      }
    }
  });

  const elCanvas = el.createDiv({
    cls: "",
    attr: { style: `width: 100%; height: auto; float: left` },
  });
  const root = createRoot(elCanvas);

  const imgTFile = vault.getAbstractFileByPath(currentImage.link);
  const imgURL = vault.adapter.getResourcePath(currentImage.link);

  // local image
  if (imgTFile instanceof TFile && EXTENSIONS.contains(imgTFile.extension)) {
    const measureEl = new Image();
    const colors = await extractColors(imgURL, EXTRACT_COLORS_OPTIONS);

    measureEl.src = imgURL;
    // update props
    props.name = props.name.length > 0 ? props.name : imgTFile.basename;
    props.imageLink = currentImage;
    props.path = imgTFile.path;
    props.extension = imgTFile.extension;
    props.date = new Date(imgTFile.stat.ctime).toString();
    props.dimensions = measureEl;
    props.size = imgTFile.stat.size / 1000000;
    props.colorList = colors;
    props.tagList = tags;
    console.log("images", images);

    const uniqueKey = currentImage.link + tags.join("-");

    // 在root上渲染React组件
    root.render(
      <AppContext.Provider value={this.app}>
        <PluginContext.Provider value={plugin}>
          <div key={uniqueKey}>
            {/*<ImageDisplay image={currentImage}/>*/}
            <JournalingImage {...props} />
          </div>
        </PluginContext.Provider>
      </AppContext.Provider>
    );
  } else if (currentImage.type === "external") {
    const NameRegex = /([^/]+)\.([a-zA-Z0-9]+)$/; // extract name and extension
    const match = currentImage.link.match(NameRegex);

    // update props
    props.name = props.name.length > 0 ? props.name : match[0];
    props.imageLink = currentImage;
    props.path = currentImage.link;
    props.extension = match[1];
    props.dimensions = null;
    props.colorList = [];
    props.tagList = tags;

    const uniqueKey = currentImage.link + tags.join("-");

    // 在root上渲染React组件
    root.render(
      <AppContext.Provider value={this.app}>
        <PluginContext.Provider value={plugin}>
          <div key={uniqueKey}>
            {/*<ImageDisplay image={currentImage}/>*/}
            <JournalingImage {...props} />
          </div>
        </PluginContext.Provider>
      </AppContext.Provider>
    );
  } else {
    MarkdownRenderer.renderMarkdown(
      PLUGIN_MARKDOWN_USAGE,
      elCanvas,
      "/",
      plugin
    );
    return;
  }
}
