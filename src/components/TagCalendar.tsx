import React from "react";
// import Calendar from "react-github-contribution-calendar";
import Calendar from "./Calendar";
import { getJournalingData } from "../data/journalingData";
import { IJournalingData, IJournalingTags } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { dateIndexToTagIndex } from "../utils/dateIndexToTagIndex";

interface TagCalendarProps {
  data: IJournalingData[];
  until: string;
}

const TagCalendar: React.FC<TagCalendarProps> = ({ data, until }) => {
  // 处理data, 获取每天日记中的图片+标签数量
  const [selectedTag, setSelectedTag] = React.useState("");
  if (data === undefined) {
    return null;
  }

  console.log("data in TagCalendar", data);
  const tagData = dateIndexToTagIndex(data);
  console.log("tagData in TagCalendar", tagData);
  const tags = Object.values(tagData).map((tagEntry) => tagEntry.tag);
  console.log("tags in TagCalendar", tags);

  const values = getTagValues(tagData, selectedTag);

  console.log("values in TagCalendar", values);
  // const {app} = useApp();
  // const data = getJournalingData();
  const panelColors = ["#EEEEEE", "#D6E685", "#8CC665", "#44A340", "#1E6823"];
  return (
    <>
      <Select onValueChange={setSelectedTag} defaultValue={selectedTag}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="tag" />
        </SelectTrigger>
        <SelectContent>
          {tags.map((tag) => (
            <SelectItem key={tag} value={tag}>
              {tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Calendar
        values={values}
        until={until}
        monthLabelAttributes={""}
        panelColors={panelColors}
        weekLabelAttributes={""}
        panelAttributes={""}
        onDateClick={(date) => {
          console.log("Clicked on date:", date, values);
        }}
      />
    </>

    // <Calendar
    //   values={values}
    //   until={until}
    //   monthLabelAttributes={""}
    //   panelColors={panelColors}
    //   weekLabelAttributes={""}
    //   panelAttributes={""}
    // />
  );
};

const getTagValues = (
  data: IJournalingTags[],
  tag: string
): { [date: string]: number } => {
  const result: { [date: string]: number } = {};

  if (tag === "") {
    // 合并所有标签的数据
    data.forEach((tagEntry) => {
      tagEntry.dates.forEach((dateEntry) => {
        const dateString = dateEntry.date.format("YYYY-MM-DD");
        if (result[dateString]) {
          result[dateString] += dateEntry.count;
        } else {
          result[dateString] = dateEntry.count;
        }
      });
    });
  } else {
    // 返回特定标签的数据
    const tagEntry = data.find((t) => t.tag === tag);
    if (tagEntry) {
      tagEntry.dates.forEach((dateEntry) => {
        const dateString = dateEntry.date.format("YYYY-MM-DD");
        result[dateString] = dateEntry.count;
      });
    }
  }

  return result;
};

export default TagCalendar;
