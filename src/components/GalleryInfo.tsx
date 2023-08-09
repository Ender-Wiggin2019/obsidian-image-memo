import React, { useEffect, useState } from "react";
import classNames from "classnames";

export interface GalleryInfoProps {
  name: string;
  path: string;
  extension: string;
  size: number;
  dimensions: HTMLImageElement | null;
  date: string;
  tagList: string[];
  colorList: { hex: string }[];
  // isVideo: boolean;
  // imgLinks: { path: string; name: string }[];
  // frontmatter: { [key: string]: any };
  infoList: string[];
}

const GalleryInfo: React.FC<GalleryInfoProps> = ({
  name,
  path,
  extension,
  size,
  dimensions,
  date,
  tagList,
  colorList,
  // isVideo,
  // imgLinks,
  // frontmatter,
  infoList,
}) => {
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    if (dimensions) {
      setWidth(dimensions.naturalWidth);
      setHeight(dimensions.naturalHeight);
    }
  }, [dimensions]);

  return (
    <div className="gallery-info-container">
      {!infoList.includes("name") && (
        <div className="gallery-info-section">
          <span className="gallery-info-section-label text-green-500">Name</span>
          <div className="gallery-info-section-value">{name}</div>
        </div>
      )}
      {!infoList.includes("path") && (
        <div className="gallery-info-section">
          <span className="gallery-info-section-label">Path</span>
          <div className="gallery-info-section-value">{path}</div>
        </div>
      )}
      {!infoList.includes("size") && (
        <div className="gallery-info-section">
          <span className="gallery-info-section-label">Size</span>
          <div className="gallery-info-section-value">{size}</div>
        </div>
      )}
      {/*...*/}
      {/*{frontmatter && Object.keys(frontmatter).map(*/}
      {/*	(yaml) =>*/}
      {/*		yaml !== "position" &&*/}
      {/*		!infoList.includes(yaml) && (*/}
      {/*			<div className="gallery-info-section">*/}
      {/*				<span className="gallery-info-section-label">{yaml}</span>*/}
      {/*				<div className="gallery-info-section-value">*/}
      {/*					{frontmatter[yaml]}*/}
      {/*				</div>*/}
      {/*			</div>*/}
      {/*		)*/}
      {/*)}*/}
      {!infoList.includes("palette") && colorList && (
        <div className="gallery-info-section mod-tags">
          <span className="gallery-info-section-label">Palette</span>
          <div className="gallery-info-section-value">
            <div style={{ width: "max-content" }}>
              {colorList.map((color) => (
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

export default GalleryInfo;
