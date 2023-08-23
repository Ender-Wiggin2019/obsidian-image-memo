import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { IJournalingImage, ImageType } from "../types";
import { usePlugin } from "../utils/pluginContext";
import { BasedImage } from "./BasedImage";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

const FrameDesc: React.FC<IJournalingImage> = (props) => {
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    if (props.dimensions) {
      setWidth(props.dimensions.naturalWidth);
      setHeight(props.dimensions.naturalHeight);
    }
  }, [props.dimensions]);

  console.log("props", props);
  return (
    <div className="art-picture-frame-desc flex flex-col p-4 h-3/4">
      {props.name && (
        <h2 className="text-zinc-900 mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {props.name}
        </h2>
      )}
      <div className="flex flex-row gap-2">
        {props.tagList.map((tag, index) => (
          <Badge
            key={index}
            className="bg-[color:var(--tag-background)] text-[color:var(--tag-color)] text-[length:var(--tag-size)]"
          >
            #{tag}
          </Badge>
        ))}
      </div>
      {props.description && props.description.length > 0 && (
        <p className="leading-7">{props.description}</p>
      )}
      <Separator className="bg-zinc-300" />
      {!props.showList.includes("path") && (
        <div className="gallery-info-section">
          <span className="gallery-info-section-label">Path</span>
          <div className="gallery-info-section-value">{props.path}</div>
        </div>
      )}
      {!props.showList.includes("size") && (
        <div className="gallery-info-section">
          <span className="gallery-info-section-label">Size</span>
          <div className="gallery-info-section-value">{props.size}</div>
        </div>
      )}
      {!props.showList.includes("date") && (
        <div className="gallery-info-section">
          <span className="gallery-info-section-label">Date</span>
          <div className="gallery-info-section-value">{props.date}</div>
        </div>
      )}
      {!props.showList.includes("palette") && props.colorList && (
        <div className="gallery-info-section mod-tags">
          <span className="gallery-info-section-label">Palette</span>
          <div className="gallery-info-section-value">
            <div style={{ width: "max-content" }}>
              {props.colorList.map((color) => (
                <div
                  key={color.hex}
                  className="gallery-info-color"
                  aria-label={color.hex}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrameDesc;
