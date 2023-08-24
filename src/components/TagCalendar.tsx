import React from "react";
import { IJournalingData, IJournalingTags } from "../types";
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
  Level,
  ThemeInput,
} from "react-activity-calendar";
import { moment } from "obsidian";
import { Moment } from "moment";
import { ISettings } from "../settings";

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
  const [selectedTag, setSelectedTag] = React.useState("");

  if (data === undefined) {
    return null;
  }

  const tagData = dateIndexToTagIndex(data);
  const tags = Object.values(tagData).map((tagEntry) => tagEntry.tag);
  tags.unshift("All");

  const calendarActivities = getCalendarActivitiesByTag(
    tagData,
    selectedTag,
    settings.dateRange
  );

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
              <MuiTooltip
                title={`${activity.count} tags on ${activity.date}`}
                disableHoverListener={true}
                disableFocusListener={true}
              >
                {block}
              </MuiTooltip>
            );
        }}
        eventHandlers={{
          onClick: () => (activity) => {
            onClickDay(moment(activity.date), false);
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
  if (tag === "" || tag === "All") {
    data.forEach((tagEntry) => {
      tagEntry.dates.forEach((dateEntry) => {
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
  activities.sort((a, b) => moment(a.date).diff(moment(b.date)));
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

  return activities;
};

export default TagCalendar;
