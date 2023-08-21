import React, { useContext, useEffect, useRef } from "react";
import { ImageLink } from "../types";
import { AppContext, useApp } from "../utils/AppContext";
import JournalingPlugin from "../main";
import { usePlugin } from "../utils/pluginContext";

type ImageDisplayProps = {
  image: ImageLink;
};

export const BasedImage: React.FC<ImageDisplayProps> = ({ image }) => {
  const app = useApp();
  const plugin = usePlugin();
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
    }
  }, [image, plugin, app]);

  // console.log("imgRef", imgRef);
  return (
    <img ref={imgRef} alt="Displayed Image" className="art-picture-frame" />
  );
};
