import React from "react";
// import Calendar from "react-github-contribution-calendar";
import Calendar from "./Calendar";
import { getJournalingData } from "../data/journalingData";

interface TagCalendarProps {
  values: { [date: string]: number };
  until: string;
}

const TagCalendar: React.FC<TagCalendarProps> = ({ values, until }) => {
  // const {app} = useApp();
  // const data = getJournalingData();
  const panelColors = ["#EEEEEE", "#D6E685", "#8CC665", "#44A340", "#1E6823"];
  return (
    <Calendar
      values={values}
      until={until}
      monthLabelAttributes={""}
      panelColors={panelColors}
      weekLabelAttributes={""}
      panelAttributes={""}
      onDateClick={(date) => {
        console.log("Clicked on date:", date);
      }}
    />

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

export default TagCalendar;
