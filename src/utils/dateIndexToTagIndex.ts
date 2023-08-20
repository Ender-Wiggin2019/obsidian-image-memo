import { IJournalingData, IJournalingTags } from "../types";

export const dateIndexToTagIndex = (
  data: IJournalingData[]
): IJournalingTags[] => {
  const tagMap: { [key: string]: IJournalingTags } = {};

  data.forEach((entry) => {
    if (!entry.dailyTags) {
      return;
    }
    entry.dailyTags.forEach((dailyTag) => {
      if (!tagMap[dailyTag.tag]) {
        tagMap[dailyTag.tag] = {
          tag: dailyTag.tag,
          dates: [],
        };
      }
      tagMap[dailyTag.tag].dates.push({
        date: entry.date,
        count: dailyTag.count,
        images: dailyTag.images,
      });
    });
  });

  return Object.values(tagMap);
};
