import React, { useEffect, useState } from "react";
import { useMeasure } from "react-use";
import { v4 as uuidv4 } from "uuid";

interface IProps {
  imgList: string[];
  width?: number;
  fillFree?: boolean;
}

const Gallery: React.FC<IProps> = ({
  imgList,
  width = 5,
  fillFree = false,
}) => {
  const [items, setItems] = useState([]);
  const [ref, { height }] = useMeasure();
  const columns = 25;

  const generateLayout = (col: number) => {
    return new Array(imgList.length).fill(null).map((item, i) => {
      const y = Math.ceil(Math.random() * 4) + 1;
      return {
        x: (i * 2) % col,
        y: Math.floor(i / 3) * y,
        w: width,
        h: y,
        id: imgList[i],
      };
    });
  };

  useEffect(() => {
    setItems(generateLayout(columns));
  }, [imgList]);

  return (
    <div ref={ref} className="grid grid-cols-5 gap-4">
      {items.map((dataItem) => (
        <div
          key={uuidv4()}
          className="internal-link"
          style={{
            backgroundImage: `url(${dataItem.id})`,
            height: `${height / dataItem.h}px`,
          }}
        />
      ))}
    </div>
  );
};

export default Gallery;
