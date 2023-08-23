import React from "react";
import { IJournalingImage } from "../../types";
import { Separator } from "../../ui/separator";
import { StarIcon, StarFilledIcon } from "@radix-ui/react-icons";

const ReviewDesc: React.FC<IJournalingImage> = (props) => {
  console.log("props", props);
  return (
    // TODO: use text-[length:var(--font-small)] for text
    <div className="flex-col text-[color:var(--text-normal)]">
      {props.name && <p className="-mt-1 text-2xl font-bold">{props.name}</p>}
      {/*<hr className="hr-text" data-content="" />*/}
      <Separator className="bg-[color:var(--text-faint)] mb-1" />
      <div className="text-lg flex justify-start my-2 gap-2">
        <span className="">
          {props.tagList.map((tag) => (
            <span key={tag}>{tag.toString()} | </span>
          ))}
        </span>
        {"   "}
        {props.rating && props.rating > 0 && (
          <span className="review-star text-lg">
            <StarRating rating={props.rating} />
          </span>
        )}
      </div>
      {props.description && props.description.length > 0 && (
        <p className="hidden md:block my-4 text-lg text-left">
          {props.description}
        </p>
      )}

      <Separator className="bg-[color:var(--text-faint)] mb-1" />
      {!props.notShow.includes("path") && props.path.length > 0 && (
        <div className="text-xs text-[color:var(--text-muted)] text-left">
          <span className="text-bold">Path: </span>
          <span className="">{props.path}</span>
        </div>
      )}
      {!props.notShow.includes("size") && props.size > 0 && (
        <div className="text-xs text-[color:var(--text-muted)] text-left">
          <span className="text-bold">Size: </span>
          <span className="">{props.size}</span>
        </div>
      )}
      {!props.notShow.includes("date") && props.date.length > 0 && (
        <div className="text-xs text-[color:var(--text-muted)] text-left">
          <span className="text-bold">Date: </span>
          <span className="">{props.date}</span>
        </div>
      )}

      {!props.notShow.includes("palette") && props.colorList.length > 0 && (
        <div className="text-xs text-[color:var(--text-muted)] text-left">
          {/*<span className="text-bold">Palette: </span>*/}
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
      )}
    </div>
  );
};

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  return (
    <span>
      {Array.from({ length: rating }).map((_, idx) => (
        <StarFilledIcon key={idx} />
      ))}
      {Array.from({ length: 5 - rating }).map((_, idx) => (
        <StarIcon key={idx + rating} />
      ))}
    </span>
  );
};
export default ReviewDesc;
