import React from "react";
import Gallery, { PhotoProps, RenderImageProps } from "react-photo-gallery";

interface IProps {
  imageList: string[];
  maxColumnWidth?: number;
}

interface MyPhotoProps extends PhotoProps {
  src: string;
}

const PhotoGallery: React.FC<IProps> = ({
  imageList,
  maxColumnWidth = 400,
}) => {
  const photos: MyPhotoProps[] = imageList.map((src) => ({
    src,
    width: maxColumnWidth,
    height: maxColumnWidth,
  }));

  const imageRenderer = ({ index, photo }: RenderImageProps<MyPhotoProps>) => {
    const imgStyle = {
      opacity: 0.9,
      transition: "opacity 0.1s ease-in-out, transform 0.1s ease-in-out",
      cursor: "pointer",
    };

    return (
      <img
        key={index}
        src={photo.src}
        alt=""
        width={photo.width}
        height={photo.height}
        style={imgStyle}
        onMouseOver={(e) => {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "scale(1.04)";
        }}
        onMouseOut={(e) => {
          (e.target as HTMLElement).style.opacity = "0.9";
          (e.target as HTMLElement).style.transform = "scale(1)";
        }}
      />
    );
  };

  return <Gallery photos={photos} margin={5} renderImage={imageRenderer} />;
};

export default PhotoGallery;
