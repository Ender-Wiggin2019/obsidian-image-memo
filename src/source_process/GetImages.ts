import { getLinkpath, Plugin, App } from "obsidian";
import { ImageLink } from "src/types";

const regexWiki = /\[\[([^\]]+)\]\]/
const regexParenthesis = /\((.*?)\)/
const regexWikiGlobal = /\[\[([^\]]*)\]\]/g
const regexMdGlobal = /\[([^\]]*)\]\(([^\(]*)\)/g

const layoutImages: Record<string, number> = {
	'a': 2,
	'b': 2,
	'c': 2,
	'd': 3,
	'e': 3,
	'f': 4,
	'g': 4,
	'h': 3,
	'i': 4,
}

export const getImages = (source: string): ImageLink[] => {
	const lines = source.split('\n').filter((row) => row.startsWith('!'));
	const images = lines.map((line) => getImageFromLine(line));
	return images.filter((image) => image !== null) as ImageLink[];
}

// export type ImageLink = {
// 	type: 'local' | 'external';
// 	link: string;
// } | {
// 	type: 'placeholder';
// }

export const getImageFromLine = (line: string): ImageLink | null => {
	if (line.match(regexMdGlobal)) {
		const link = line.match(regexParenthesis)?.[1];
		if (link) {
			return { type: 'external', link };
		}
	} else if (line.match(regexWikiGlobal)) {
		const link = line.match(regexWiki)?.[1];
		if (link) {
			return {
				type: 'local',
				link: link
			}
		}
	}
	return null;
}

const addImageFromLink = (app: App, link: string, sourcePath: string, parent: HTMLElement, plugin: Plugin) => {
	var destFile = app.metadataCache.getFirstLinkpathDest(link, sourcePath);
	if (destFile) {
		const img = parent.createEl("img");
		img.src = plugin.app.vault.adapter.getResourcePath(destFile.path);
	}
}

const addExternalImage = (link: string, parent: HTMLElement) => {
	const img = parent.createEl("img");
	img.src = link;
}

const addPlaceHolder = (widthXHeight: string, parent: HTMLElement) => {
	widthXHeight = widthXHeight ?? "640x480";
	const img = parent.createEl("img");
	img.src = `https://via.placeholder.com/${widthXHeight}`;
}

// FIXME

const renderLayout = (
	app: App,
	images: ImageLink[],
	layout: string,
	sourcePath: string,
	parent: HTMLElement,
	plugin: Plugin) => {

	// add placeholders if images are missing
	const layoutImagesCount = layoutImages[layout];
	if (images.length < layoutImagesCount) {
		for (let i = images.length; i < layoutImagesCount; i++) {
			images.push({ type: 'placeholder' });
		}
	}
	if (images.length > layoutImagesCount) {
		images = images.slice(0, layoutImagesCount);
	}

	const div = parent.createEl("div", { cls: `image-layouts-grid image-layouts-layout-${layout}` });

	images.forEach((image, idx) => {
		const imgdiv = div.createEl("div", { cls: `image-layouts-image-${idx}` });
		if (image.type === 'local') {
			addImageFromLink(app, image.link, sourcePath, imgdiv, plugin);
		} else if (image.type === 'external') {
			console.log(image.link);
			addExternalImage(image.link, imgdiv);
		} else if (image.type === 'placeholder') {
			addPlaceHolder('640x480', imgdiv);
		}
	});
}

const renderMasonryLayout = (
	app: App,
	images: ImageLink[],
	columns: number,
	sourcePath: string,
	parent: HTMLElement,
	plugin: Plugin) => {
	const div = parent.createEl("div", { cls: `image-layouts-masonry-grid-${columns}` });

	// create the an array of divs to hold the images
	const columnDivs: HTMLElement[] = [];
	for (let i = 0; i < columns; i++) {
		const colDiv = div.createEl("div", { cls: `image-layouts-masonry-column` });
		columnDivs.push(colDiv);
	}

	images.forEach((image, idx) => {
		const colIdx = idx % columns;
		const imgdiv = columnDivs[colIdx].createEl("div", { cls: `image-layouts-masonry-image-${idx}` });
		if (image.type === 'local') {
			addImageFromLink(app, image.link, sourcePath, imgdiv, plugin);
		} else if (image.type === 'external') {
			console.log(image.link);
			addExternalImage(image.link, imgdiv);
		}
	});
}
