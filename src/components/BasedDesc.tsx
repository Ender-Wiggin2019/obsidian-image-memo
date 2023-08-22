import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { IJournalingImage, ImageType } from "../types";
import { usePlugin } from "../utils/pluginContext";
import { BasedImage } from "./BasedImage";
import { Badge } from "../ui/badge";

const BasedDesc: React.FC<IJournalingImage> = (props) => {
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
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {props.name}
        </h2>
      )}
      <div className="flex flex-row gap-2">
        {props.tagList.map((tag, index) => (
          <Badge key={index} className="bg-zinc-800 text-zinc-50">
            {tag}
          </Badge>
        ))}
      </div>
      {props.description && props.description.length > 0 && (
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {props.description}
        </p>
      )}
      {!props.showList.includes("name") && (
        <div className="gallery-info-section">
          <span className="gallery-info-section-label text-red-500">Name</span>
          <div className="gallery-info-section-value">{props.name}</div>
        </div>
      )}
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
      {!props.showList.includes("description") && (
        <div className="gallery-info-section">
          <span className="gallery-info-section-label">Description</span>
          <div className="gallery-info-section-value">{props.description}</div>
        </div>
      )}
      {/*...*/}
      {/*{frontmatter && Object.keys(frontmatter).map(*/}
      {/*	(yaml) =>*/}
      {/*		yaml !== "position" &&*/}
      {/*		!props.showList.includes(yaml) && (*/}
      {/*			<div className="gallery-info-section">*/}
      {/*				<span className="gallery-info-section-label">{yaml}</span>*/}
      {/*				<div className="gallery-info-section-value">*/}
      {/*					{frontmatter[yaml]}*/}
      {/*				</div>*/}
      {/*			</div>*/}
      {/*		)*/}
      {/*)}*/}
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

export default BasedDesc;
