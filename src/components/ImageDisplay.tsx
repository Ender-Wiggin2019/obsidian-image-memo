import React, { useContext, useEffect, useRef } from "react";
import { ImageLink } from "../types";
import { AppContext } from "../utils/AppContext";
import JournalingPlugin from "../main";

type ImageDisplayProps = {
  image: ImageLink;
  // parent: HTMLElement;
  // sourcePath?: string;
  plugin?: JournalingPlugin;
};

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  image,
  plugin,
}) => {
  const app = useContext(AppContext);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (image.type === "local" && plugin) {
      const destFile = app.metadataCache.getFirstLinkpathDest(
        image.link,
        image.link
      );
      if (destFile) {
        if (imgRef.current) {
          imgRef.current.src = plugin.app.vault.adapter.getResourcePath(
            destFile.path
          );
        }
      }
    } else if (image.type === "external") {
      if (imgRef.current) {
        imgRef.current.src = image.link;
      }
    } // 如果是 'placeholder'，你可以按需求处理
  }, [image, plugin, app]);

  console.log("imgRef", imgRef);
  return <img ref={imgRef} alt="Displayed Image" />;
};
