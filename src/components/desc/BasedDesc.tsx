import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { IJournalingImage, ImageType } from "../../types";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";

const BasedDesc: React.FC<IJournalingImage> = (props) => {
  return (
    <div className="art-picture-frame-desc flex flex-col p-2 h-3/4">
      {props.name && (
        <h2 className="text-[color:var(--text-normal)] border-b pb-1 text-3xl font-semibold">
          {props.name}
        </h2>
      )}
      <div className="flex flex-row gap-2">
        {props.tagList.map((tag, index) => (
          <Badge
            key={index}
            className="bg-[color:var(--tag-background)] text-[color:var(--tag-color)] text-md"
          >
            #{tag}
          </Badge>
        ))}
      </div>
      {props.description && props.description.length > 0 && (
        <p className="leading-6 text-[color:var(--text-normal]">
          {props.description}
        </p>
      )}
      <Separator className="bg-[color:var(--text-muted)] mb-1" />
      <div className="">
        {!props.notShow.includes("path") && props.path.length > 0 && (
          <div className="art-picture-frame-section">
            <span className="art-picture-frame-section-label">Path</span>
            <div className="art-picture-frame-section-value">{props.path}</div>
          </div>
        )}
        {!props.notShow.includes("size") && props.size > 0 && (
          <div className="art-picture-frame-section">
            <span className="art-picture-frame-section-label">Size</span>
            <div className="art-picture-frame-section-value">
              {props.size.toFixed(2)} MB
            </div>
          </div>
        )}
        {!props.notShow.includes("date") && props.date.length > 0 && (
          <div className="art-picture-frame-section">
            <span className="art-picture-frame-section-label">Date</span>
            <div className="art-picture-frame-section-value">{props.date}</div>
          </div>
        )}
        {!props.notShow.includes("palette") && props.colorList.length > 0 && (
          <div className="art-picture-frame-section mod-tags">
            <span className="art-picture-frame-section-label">Palette</span>
            <div className="art-picture-frame-section-value">
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
    </div>
  );
};

export default BasedDesc;
