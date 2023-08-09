import React from "react";
import Calendar from "react-github-contribution-calendar";

interface TagCalendarProps {
  values: { [date: string]: number };
  until: string;
}

const panelAttributes = {
  panelColors: ["#EEEEEE", "#F78A23", "#F87D09", "#AC5808", "#7B3F06"],
};
const TagCalendar: React.FC<TagCalendarProps> = ({ values, until }) => {
  return (
    <Calendar
      values={values}
      until={until}
      monthLabelAttributes={""}
      panelAttributes={panelAttributes}
      weekLabelAttributes={""}
    />
  );
};

export default TagCalendar;
