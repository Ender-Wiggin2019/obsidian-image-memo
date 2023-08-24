import { ImageLink } from "src/types";

// match the style like ![[xxx.png]]
const regexWiki = /\[\[([^\]]+)\]\]/;
const regexWikiGlobal = /\[\[([^\]]*)\]\]/g;

// match the style like ![](xxx.png)
const regexMdLocalImage = /!\[.*?\]\(([^http].*?)\)/;
const regexMdExternalImage = /\((http[^)]+)\)/;
const regexMdGlobal = /!\[([^\]]*)\]\(([^(]*)\)/g;

export const getImages = (source: string): ImageLink[] => {
  const lines = source.split("\n").filter((row) => row.startsWith("!"));
  const images = lines.map((line) => getImageFromLine(line));
  return images.filter((image) => image !== null) as ImageLink[];
};

export const getImageFromLine = (line: string): ImageLink | null => {
	if (line.match(regexMdGlobal)) {
		const link = line.match(regexMdExternalImage)?.[1];
		if (link) {
			return { type: "external", link };
		}
		const link2 = line.match(regexMdLocalImage)?.[1];
		if (link2) {
			return { type: "local", link: link2 };
		}
	} else if (line.match(regexWikiGlobal)) { // match wiki must be local file
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
