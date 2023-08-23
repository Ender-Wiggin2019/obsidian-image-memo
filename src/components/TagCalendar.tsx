import React, { useEffect } from "react";
// import Calendar from "react-github-contribution-calendar";
import Calendar from "./Calendar";
import { getJournalingData } from "../data/journalingData";
import { ICalendarEntry, IJournalingData, IJournalingTags } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Tooltip as MuiTooltip } from "@mui/material";
import { dateIndexToTagIndex } from "../utils/dateIndexToTagIndex";
import ActivityCalendar, {
  Activity,
  Color,
  ColorScale,
  Level,
  ThemeInput,
} from "react-activity-calendar";
import { moment } from "obsidian";
import { Moment } from "moment";
import { ISettings } from "../settings";
import { ILocaleOverride, IWeekStartOption } from "obsidian-calendar-ui";
import { usePlugin } from "../utils/pluginContext";

interface TagCalendarProps {
  data: IJournalingData[];
  settings: ISettings;
  onClickDay: (date: Moment, inNewSplit: boolean) => Promise<void>;
}

const TagCalendar: React.FC<TagCalendarProps> = ({
  data,
  settings,
  onClickDay,
}) => {
  // 处理data, 获取每天日记中的图片+标签数量
  // FIXME: plugin 实时更新
  // const plugin = usePlugin();
  // console.log('setting3', plugin.settings);
  const [selectedTag, setSelectedTag] = React.useState("");

  if (data === undefined) {
    return null;
  }

  console.log("onClickDay type", typeof onClickDay);
  const tagData = dateIndexToTagIndex(data);
  console.log("tagData in TagCalendar", tagData);
  const tags = Object.values(tagData).map((tagEntry) => tagEntry.tag);
  tags.unshift("all");

  console.log("tags in TagCalendar", tags);

  const calendarActivities = getCalendarActivitiesByTag(
    tagData,
    selectedTag,
    60
  ); // TODO: range should be in setting

  // test
  console.log("calendarActivities in TagCalendar", calendarActivities);
  // const {app} = useApp();
  // const data = getJournalingData();
  const colors: [from: Color, to: Color] = [
    settings.fromColor,
    settings.toColor,
  ];

  const theme: ThemeInput = {
    light: colors,
    dark: colors,
  };
  const weekdays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  return (
    <div className="flex flex-col gap-4">
      <ActivityCalendar
        data={calendarActivities}
        blockSize={settings.blockSize}
        blockRadius={settings.blockRadius}
        fontSize={settings.fontSize}
        theme={theme}
        hideColorLegend={true}
        hideTotalCount={true}
        hideMonthLabels={settings.hideMonthLabels}
        showWeekdayLabels={settings.showWeekdayLabels}
        weekStart={weekdays.indexOf(settings.weekStart) as Day}
        renderBlock={(block, activity) => {
          if (activity.count === 0) return block;
          else
            return (
              <MuiTooltip title={`${activity.count} tags on ${activity.date}`}>
                {block}
              </MuiTooltip>
            );
        }}
        eventHandlers={{
          onClick: (event) => (activity) => {
            // alert(JSON.stringify(activity));
            onClickDay(moment(activity.date), false);
          },
          onMouseEnter: (event) => (activity) => {
            console.log("on mouse enter");
          },
        }}
      />
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
    </div>

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
const getCalendarActivitiesByTag = (
  data: IJournalingTags[],
  tag: string,
  range: number
): Activity[] => {
  const result: { [date: string]: number } = {};
  const endDate = moment();
  const startDate = moment().subtract(range, "days");

  let startFlag = 0,
    endFlag = 0;
  // Populate the result dictionary as before
  if (tag === "" || tag === "all") {
    data.forEach((tagEntry) => {
      tagEntry.dates.forEach((dateEntry) => {
        console.log("check", dateEntry.date, dateEntry.date === endDate);
        if (dateEntry.date < startDate || dateEntry.date > endDate) return;
        else if (
          dateEntry.date.format("YYYY-MM-DD") === startDate.format("YYYY-MM-DD")
        )
          startFlag = 1;
        else if (
          dateEntry.date.format("YYYY-MM-DD") === endDate.format("YYYY-MM-DD")
        )
          endFlag = 1;

        const dateString = dateEntry.date.format("YYYY-MM-DD");
        if (result[dateString]) {
          result[dateString] += dateEntry.count;
        } else {
          result[dateString] = dateEntry.count;
        }
      });
    });
  } else {
    const tagEntry = data.find((t) => t.tag === tag);
    if (tagEntry) {
      tagEntry.dates.forEach((dateEntry) => {
        const dateString = dateEntry.date.format("YYYY-MM-DD");
        result[dateString] = dateEntry.count;
      });
    }
  }

  // Calculate the maximum count value
  const maxCount = Math.max(...Object.values(result));

  // Convert the dictionary into the desired output format
  const activities: Activity[] = Object.entries(result).map(([date, count]) => {
    let level: Level = 0;
    const ratio = count / maxCount;

    if (maxCount <= 4) level = count as Level;
    else if (ratio > 0 && ratio <= 0.25) level = 1;
    else if (ratio > 0.25 && ratio <= 0.5) level = 2;
    else if (ratio > 0.5 && ratio <= 0.75) level = 3;
    else if (ratio > 0.75 && ratio <= 1) level = 4;

    return { date, count, level };
  });
  if (!startFlag) {
    activities.unshift({
      date: startDate.format("YYYY-MM-DD"),
      count: 0,
      level: 0,
    });
  }
  if (!endFlag) {
    activities.push({
      date: endDate.format("YYYY-MM-DD"),
      count: 0,
      level: 0,
    });
  }

  console.log("activities", activities, endFlag);

  return activities;
};

export default TagCalendar;
