import React, { useEffect, useState } from "react";
import { IJournalingImage, ImageType } from "../../types";
import { Separator } from "../../ui/separator";
import { StarIcon, StarFilledIcon } from "@radix-ui/react-icons";

const ReviewDesc: React.FC<IJournalingImage> = (props) => {
  console.log("props", props);
  return (
    <div className="flex-col text-zinc-300">
      {props.name && <p className="pt-4 text-2xl font-bold">{props.name}</p>}
      {/*<hr className="hr-text" data-content="" />*/}
      <Separator className="bg-zinc-600" />
      <div className="text-md flex justify-start my-2 gap-2">
        <span className="">
          {props.tagList.map((tag, index) => (
            <span>{tag.toString()} | </span>
          ))}
        </span>
        {"   "}
        {props.rating && props.rating > 0 && (
          <span className="flex text-yellow-500">
            <StarRating rating={props.rating} />
          </span>
        )}
        <span className="font-bold"></span>
      </div>
      {props.description && props.description.length > 0 && (
        <p className="hidden md:block my-4 text-sm text-left">
          {props.description}
        </p>
      )}

      <Separator className="bg-zinc-600" />
      {!props.showList.includes("path") && (
        <div className="text-sm text-left">
          <span className="text-bold">Path: </span>
          <span className="">{props.path}</span>
        </div>
      )}
      {!props.showList.includes("size") && (
        <div className="text-sm text-left">
          <span className="text-bold">Size: </span>
          <span className="">{props.size}</span>
        </div>
      )}
      {!props.showList.includes("date") && (
        <div className="text-sm text-left">
          <span className="text-bold">Date: </span>
          <span className="">{props.date}</span>
        </div>
      )}

      {!props.showList.includes("palette") && props.colorList && (
        <div className="text-sm text-left">
          <span className="text-bold">Palette: </span>
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
