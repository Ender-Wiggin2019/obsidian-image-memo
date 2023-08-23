import React, { useEffect, useRef } from "react";
import { ImageLink, ImageType } from "../types";
import { useApp } from "../utils/AppContext";
import { usePlugin } from "../utils/pluginContext";
import { cn } from "../lib/utils";

type ImageDisplayProps = {
  image: ImageLink;
  imageType: ImageType;
};

export const BasedImage: React.FC<ImageDisplayProps> = ({
  image,
  imageType,
}) => {
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
      console.log("link3", image.link);
      if (imgRef.current) {
        imgRef.current.src = image.link;
      }
    }
  }, [image, plugin, app]);

  // console.log("imgRef", imgRef);
  if (imageType === ImageType.REVIEW) {
    return (
      <img
        ref={imgRef}
        alt="Displayed Image"
        className="review-picture h-auto rounded-md shadow-2xl shadow-lg"
      />
    );
  }
  return (
    <img
      ref={imgRef}
      alt="Displayed Image"
      className={cn(
        { "art-picture-frame": imageType === ImageType.ART },
        { "photo-picture": imageType === ImageType.PHOTO }
      )}
    />
  );
};
