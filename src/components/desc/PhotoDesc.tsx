import React from "react";
import { IJournalingImage } from "../../types";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";

const PhotoDesc: React.FC<IJournalingImage> = (props) => {
  return (
    <div className=" flex flex-col p-4 h-3/4">
      {props.description && props.description.length > 0 && (
        <p className="underline underline-offset-8 leading-7 text-[color:var(--text-normal)] decoration-[color:var(--text-faint)]">
          {props.description}
        </p>
      )}
      {/*<Separator className="bg-[color:var(--text-muted)] mb-1" />*/}
      <div className="">
        {!props.notShow.includes("path") && props.path.length > 0 && (
          <div className="underline underline-offset-8 leading-7 decoration-[color:var(--text-faint)] text-[color:var(--text-muted)]">
            Path: {props.path}
          </div>
        )}
        {!props.notShow.includes("size") && props.size > 0 && (
          <div className="underline underline-offset-8 leading-7 decoration-[color:var(--text-faint)] text-[color:var(--text-muted)]">
            Size: {props.size.toFixed(2)} MB
          </div>
        )}
        {!props.notShow.includes("date") && props.date.length > 0 && (
          <div className="underline underline-offset-8 leading-7 decoration-[color:var(--text-faint)] text-[color:var(--text-muted)]">
            Date: {props.date}
          </div>
        )}
        {!props.notShow.includes("palette") && props.colorList.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default PhotoDesc;
