import { getLinkpath, Plugin, App } from "obsidian";
import { ImageLink } from "src/types";

const regexWiki = /\[\[([^\]]+)\]\]/;
const regexParenthesis = /\((.*?)\)/;
const regexMdImage = /!\[.*?\]\((.*?)\)/;
const regexWikiGlobal = /\[\[([^\]]*)\]\]/g;
const regexMdGlobal = /\[([^\]]*)\]\(([^\(]*)\)/g;

export const getImages = (source: string): ImageLink[] => {
  const lines = source.split("\n").filter((row) => row.startsWith("!"));
  const images = lines.map((line) => getImageFromLine(line));
  return images.filter((image) => image !== null) as ImageLink[];
};

export const getImageFromLine = (line: string): ImageLink | null => {
  console.log("link0", line);
  if (line.match(regexMdGlobal)) {
    const link = line.match(regexMdImage)?.[1];
    if (link) {
      console.log("link1", link);
      return { type: "external", link };
    }
  } else if (line.match(regexWikiGlobal)) {
    const link = line.match(regexWiki)?.[1];
    if (link) {
      return {
        type: "local",
        link: link,
      };
    }
  }
  return null;
};
