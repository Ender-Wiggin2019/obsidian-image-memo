import type { Vault, MetadataCache, WorkspaceLeaf } from 'obsidian';
import { MarkdownRenderer, TFile, getAllTags } from 'obsidian';
import JournalingPlugin from "./main";
import { extractColors } from 'extract-colors';
import {
	EXTENSIONS,
	EXTRACT_COLORS_OPTIONS,
	GALLERY_INFO_USAGE,
	InfoBlockArgs,
	OB_GALLERY_INFO,
	VIDEO_REGEX
} from "./types";
import GalleryInfo, { GalleryInfoProps } from "./ui/GalleryInfo";
import { getImgInfo } from "./utils";
import React from "react";
import {createRoot} from 'react-dom/client'
import DiceRoller from "./ui/DicerRoller";
import ReactDOM from "react-dom";

export async function imageInfo(source: string, el: HTMLElement, vault: Vault, metadata: MetadataCache, plugin: JournalingPlugin) {

	let args: InfoBlockArgs = {
		imgPath: '',
		ignoreInfo: ''
	};

	source.split('\n').map(e => {
		if (e) {
			let param = e.trim().split('=');
			(args as any)[param[0]] = param[1]?.trim();
		}
	});

	let infoList = args.ignoreInfo.split(';').map(param => param.trim().toLowerCase()).filter(e => e !== "");
	let imgName = args.imgPath.split('/').slice(-1)[0];
	let elCanvas = el.createDiv({
		cls: 'ob-gallery-info-block',
		attr: { 'style': `width: 100%; height: auto; float: left` }
	});

	let imgTFile = vault.getAbstractFileByPath(args.imgPath);
	let imgURL = vault.adapter.getResourcePath(args.imgPath);

	// Handle problematic arg
	if (!args.imgPath || !imgTFile) {
		MarkdownRenderer.renderMarkdown(GALLERY_INFO_USAGE, elCanvas, '/', plugin);
		return;
	}

	let measureEl, colors, isVideo;
	// Get image dimensions
	if (imgURL.match(VIDEO_REGEX)) {
		measureEl = document.createElement('video');
		isVideo = true;
	} else {
		measureEl = new Image();
		colors = await extractColors(imgURL, EXTRACT_COLORS_OPTIONS);
		isVideo = false;
	}

	measureEl.src = imgURL;

	// Handle disabled img info functionality or missing info block
	let imgInfo = await getImgInfo(imgTFile.path, vault, metadata, plugin, false);
	let imgTags = null;

	console.log('args', imgInfo)
	console.log('imgInfo', !imgInfo)
	if (!imgInfo) {
		MarkdownRenderer.renderMarkdown(GALLERY_INFO_USAGE, elCanvas, '/', plugin);
		return;
	}

	let imgInfoCache = metadata.getFileCache(imgInfo);
	if (imgInfo) {
		imgTags = getAllTags(imgInfoCache);
	}

	let imgLinks: { path: string; name: string; }[] = [];
	vault.getMarkdownFiles().forEach(mdFile => {
		metadata.getFileCache(mdFile)?.links?.forEach(link => {
			if (link.link === args.imgPath || link.link === imgName) {
				imgLinks.push({path: mdFile.path, name: mdFile.basename});
			}
		});
	});

	console.log('imgTFile', imgTFile, imgTFile instanceof TFile && EXTENSIONS.contains(imgTFile.extension))
	if (imgTFile instanceof TFile && EXTENSIONS.contains(imgTFile.extension)) {
		const props: GalleryInfoProps = {
			name: imgTFile.basename,
			path: imgTFile.path,
			extension: imgTFile.extension,
			date: new Date(imgTFile.stat.ctime).toString(),
			dimensions: measureEl,
			size: imgTFile.stat.size / 1000000,
			colorList: colors,
			tagList: imgTags,
			isVideo: isVideo,
			imgLinks: imgLinks,
			frontmatter: imgInfoCache.frontmatter,
			infoList: infoList
		}
		// const reactComponent = React.createElement(GalleryInfo, props);
		//
		// // eslint-disable-next-line @typescript-eslint/no-explicit-any
		// ReactDOM.render(reactComponent, elCanvas);

		const root = createRoot(elCanvas);

		// TODO: TEST


// 在root上渲染React组件
		root.render(<GalleryInfo {...props} />);

		// new GalleryInfo({
		// 	props: {
		// 		name: imgTFile.basename,
		// 		path: imgTFile.path,
		// 		extension: imgTFile.extension,
		// 		date: new Date(imgTFile.stat.ctime),
		// 		dimensions: measureEl,
		// 		size: imgTFile.stat.size / 1000000,
		// 		colorList: colors,
		// 		tagList: imgTags,
		// 		isVideo: isVideo,
		// 		imgLinks: imgLinks,
		// 		frontmatter: imgInfoCache.frontmatter,
		// 		infoList: infoList
		// 	},
		// 	target: elCanvas
		// });
	}

	elCanvas.onClickEvent(async (event) => {
		if (event.button === 2) {
			// Open image info view in side panel
			let workspace = plugin.app.workspace;
			workspace.detachLeavesOfType(OB_GALLERY_INFO);
			await workspace.getRightLeaf(false).setViewState({ type: OB_GALLERY_INFO });
			workspace.revealLeaf(
				await workspace.getLeavesOfType(OB_GALLERY_INFO)[0]
			);
			let infoView = workspace.getLeavesOfType(OB_GALLERY_INFO)[0]?.view;
			// TODO
			// if (infoView instanceof GalleryInfoView) {
			// 	infoView.infoFile = imgInfo;
			// 	infoView.editor.setValue(await vault.cachedRead(imgInfo));
			// 	infoView.render();
			// }
		}
	});
}
