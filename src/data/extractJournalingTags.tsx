/**
 * Extract tags and image links from a string that matches the `journaling` format.
 *
 * @param input The string to parse.
 * @returns An array of IJournalingDailyTag objects.
 */
import { IJournalingDailyTag } from "../types";

export function extractJournalingTags(input: string): IJournalingDailyTag[] {
  const journalingRegex = /```journaling\s*([\s\S]*?)```/g;
  const tagRegex = /#(\w+)/g;
  const imageRegex = /!\[\[([^\]]+)\]\]/g;

  const tagMap: Record<string, { count: number; images: string[] }> = {};

  let journalingMatch;
  while ((journalingMatch = journalingRegex.exec(input)) !== null) {
    const blockContent = journalingMatch[1];

    // Extract tags
    let tagMatch;
    while ((tagMatch = tagRegex.exec(blockContent)) !== null) {
      const tag = tagMatch[1];
      if (!tagMap[tag]) {
        tagMap[tag] = {
          count: 0,
          images: [],
        };
      }
      tagMap[tag].count += 1;
    }

    // Extract images
    let imageMatch;
    while ((imageMatch = imageRegex.exec(blockContent)) !== null) {
      const imagePath = imageMatch[1];
      for (const tag in tagMap) {
        if (blockContent.includes(`#${tag}`)) {
          tagMap[tag].images.push(imagePath);
        }
      }
    }
  }

  // Convert to the desired format
  const result: IJournalingDailyTag[] = [];
  for (const tag in tagMap) {
    result.push({
      tag,
      count: tagMap[tag].count,
      images: tagMap[tag].images,
    });
  }

  return result;
}
