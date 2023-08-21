import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { IJournalingImage, ImageType } from "../types";
import { BasedImage } from "./BasedImage";
import { Badge } from "../ui/badge";
import BasedDesc from "./BasedDesc";

const JournalingImage: React.FC<IJournalingImage> = (props) => {
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    if (props.dimensions) {
      setWidth(props.dimensions.naturalWidth);
      setHeight(props.dimensions.naturalHeight);
    }
  }, [props.dimensions]);

  // console.log("infoList", infoList);
  return (
    <div className="gallery-info-container">
      {/*<div className='art-picture-frame'>*/}
      <div className="flex flex-row justify-center gap-4 mx-5">
        <BasedImage image={props.imageLink} />
        <BasedDesc {...props} />
      </div>
      {/*	???*/}
      {/*</div>*/}
      {props.tagList.map((tag, index) => (
        <Badge key={index} className="bg-zinc-800 text-zinc-50">
          {tag}
        </Badge>
      ))}
      {!props.infoList.includes("name") && (
        <div className="gallery-info-section">
          <span className="gallery-info-section-label text-red-500">Name</span>
          <div className="gallery-info-section-value">{props.name}</div>
        </div>
      )}
      {!props.infoList.includes("path") && (
        <div className="gallery-info-section">
          <span className="gallery-info-section-label">Path</span>
          <div className="gallery-info-section-value">{props.path}</div>
        </div>
      )}
      {!props.infoList.includes("size") && (
        <div className="gallery-info-section">
          <span className="gallery-info-section-label">Size</span>
          <div className="gallery-info-section-value">{props.size}</div>
        </div>
      )}
      {!props.infoList.includes("date") && (
        <div className="gallery-info-section">
          <span className="gallery-info-section-label">Date</span>
          <div className="gallery-info-section-value">{props.date}</div>
        </div>
      )}
      {!props.infoList.includes("description") && (
        <div className="gallery-info-section">
          <span className="gallery-info-section-label">Description</span>
          <div className="gallery-info-section-value">{props.description}</div>
        </div>
      )}
      {/*...*/}
      {/*{frontmatter && Object.keys(frontmatter).map(*/}
      {/*	(yaml) =>*/}
      {/*		yaml !== "position" &&*/}
      {/*		!props.infoList.includes(yaml) && (*/}
      {/*			<div className="gallery-info-section">*/}
      {/*				<span className="gallery-info-section-label">{yaml}</span>*/}
      {/*				<div className="gallery-info-section-value">*/}
      {/*					{frontmatter[yaml]}*/}
      {/*				</div>*/}
      {/*			</div>*/}
      {/*		)*/}
      {/*)}*/}
      {!props.infoList.includes("palette") && props.colorList && (
        <div className="gallery-info-section mod-tags">
          <span className="gallery-info-section-label">Palette</span>
          <div className="gallery-info-section-value">
            <div style={{ width: "max-content" }}>
              {props.colorList.map((color) => (
                <div
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

export default JournalingImage;
