import { getAllDailyNotes, getDailyNote } from "obsidian-daily-notes-interface";
import { IJournalingDailyTag, IJournalingData } from "../types";
import { Moment } from "moment";
import { App, TFile } from "obsidian";
import { extractJournalingTags } from "./extractJournalingTags";

export const getJournalingData = async (
  app: App,
  dates: Moment[]
): Promise<IJournalingData[]> => {
  const dailyNotes = getAllDailyNotes();
  const journalingData: IJournalingData[] = [];
  for (const date of dates) {
    // dailyNote is a TFile
    const dailyNote = getDailyNote(date, dailyNotes);

    const journalingDailyTag = await getJournalingDailyTag(app, dailyNote);

    journalingData.push({ date: date, dailyTags: journalingDailyTag });
  }

  return journalingData;
};

export async function getJournalingDailyTag(
  app: App,
  note: TFile
): Promise<IJournalingDailyTag[]> {
  if (!note) {
    return null;
  }
  const fileContents = await app.vault.cachedRead(note);

  // find tags from fileContents
  return extractJournalingTags(fileContents);
}
