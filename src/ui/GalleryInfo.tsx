import React, { useEffect, useState } from "react";

interface IProps {
  name: string;
  path: string;
  extension: string;
  size: string;
  dimensions: HTMLImageElement | null;
  date: string;
  tagList: string[];
  colorList: { hex: string }[];
  isVideo: boolean;
  imgLinks: { path: string; name: string }[];
  frontmatter: { [key: string]: any };
  infoList: string[];
}

const GalleryInfo: React.FC<IProps> = ({
  name,
  path,
  extension,
  size,
  dimensions,
  date,
  tagList,
  colorList,
  isVideo,
  imgLinks,
  frontmatter,
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
    <div
      style={
        {
          /* your style here */
        }
      }
    >
      {!infoList.includes("name") && (
        <div
          style={
            {
              /* your style here */
            }
          }
        >
          <span>Name</span>
          <div>{name}</div>
        </div>
      )}
      {!infoList.includes("path") && (
        <div
          style={
            {
              /* your style here */
            }
          }
        >
          <span>Path</span>
          <div>{path}</div>
        </div>
      )}
      {!infoList.includes("extension") && (
        <div
          style={
            {
              /* your style here */
            }
          }
        >
          <span>Extension</span>
          <div>{extension}</div>
        </div>
      )}
      {!infoList.includes("size") && (
        <div
          style={
            {
              /* your style here */
            }
          }
        >
          <span>Size</span>
          <div>{size} Mb</div>
        </div>
      )}
      {!infoList.includes("dimension") && (
        <div
          style={
            {
              /* your style here */
            }
          }
        >
          <span>Dimensions</span>
          <div>
            {isVideo
              ? `${width} x ${height} px`
              : `${dimensions?.naturalWidth} x ${dimensions?.naturalHeight} px`}
          </div>
        </div>
      )}
      {!infoList.includes("date") && (
        <div
          style={
            {
              /* your style here */
            }
          }
        >
          <span>Date</span>
          <div>{date}</div>
        </div>
      )}
      {!infoList.includes("tags") && tagList && (
        <div
          style={
            {
              /* your style here */
            }
          }
        >
          <span>Tags</span>
          <div
            style={
              {
                /* your style here */
              }
            }
          >
            {tagList.map((tag) => (
              <a
                key={tag}
                href={tag}
                style={
                  {
                    /* your style here */
                  }
                }
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      )}
      {!infoList.includes("backlinks") && (
        <div
          style={
            {
              /* your style here */
            }
          }
        >
          <span>Backlinks</span>
          <div>
            {imgLinks.map((link) => (
              <li
                key={link.path}
                style={
                  {
                    /* your style here */
                  }
                }
              >
                <a href={link.path}>{link.name}</a>
              </li>
            ))}
          </div>
        </div>
      )}
      {Object.keys(frontmatter).map(
        (yaml) =>
          yaml !== "position" &&
          !infoList.includes(yaml) && (
            <div
              key={yaml}
              style={
                {
                  /* your style here */
                }
              }
            >
              <span>{yaml}</span>
              <div>{frontmatter[yaml]}</div>
            </div>
          )
      )}
      {!infoList.includes("palette") && colorList && (
        <div
          style={
            {
              /* your style here */
            }
          }
        >
          <span>Palette</span>
          <div
            style={
              {
                /* your style here */
              }
            }
          >
            {colorList.map((color) => (
              <div
                key={color.hex}
                aria-label={color.hex}
                style={{
                  backgroundColor: color.hex /* and your other styles here */,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryInfo;
