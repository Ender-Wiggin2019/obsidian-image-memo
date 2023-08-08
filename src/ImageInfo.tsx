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
import { getImageResources, getImgInfo } from "./utils";
import React from "react";
import {createRoot} from 'react-dom/client'
import DiceRoller from "./ui/DicerRoller";
import ReactDOM from "react-dom";
import { getImages } from "./source_process/GetImages";
import { AppContext } from './utils/AppContext';
import { ImageDisplay } from "./ui/ImageDisplay";
import { getTags } from "./source_process/GetTags";

export async function imageInfo(source: string, el: HTMLElement, vault: Vault, metadata: MetadataCache, plugin: JournalingPlugin) {

	// Get all images
	const images = getImages(source);
	const tags = getTags(source);

	let args: InfoBlockArgs = {
		imgPath: '',
		ignoreInfo: ''
	};

	// get the arguments
	source.split('\n').map(e => {
		if (e) {
			let param = e.trim().split('=');
			(args as any)[param[0]] = param[1]?.trim();
		}
	});

	let infoList = args.ignoreInfo.split(';').map(param => param.trim().toLowerCase()).filter(e => e !== "");
	let imgName = images[0].link.split('/').slice(-1)[0];
	let elCanvas = el.createDiv({
		cls: 'ob-gallery-info-block',
		attr: { 'style': `width: 100%; height: auto; float: left` }
	});

	// let imgTFile = vault.getAbstractFileByPath(args.imgPath);
	let imgTFile = vault.getAbstractFileByPath(images[0].link);
	let imgURL = vault.adapter.getResourcePath(images[0].link);

	// Handle problematic arg
	// if (!args.imgPath || !imgTFile) {
	// 	MarkdownRenderer.renderMarkdown(GALLERY_INFO_USAGE, elCanvas, '/', plugin);
	// 	return;
	// }

	let measureEl, colors, isVideo;
	// Get image dimensions
	// if (imgURL.match(VIDEO_REGEX)) {
	// 	measureEl = document.createElement('video');
	// 	isVideo = true;
	// } else {
	// 	measureEl = new Image();
	// 	colors = await extractColors(imgURL, EXTRACT_COLORS_OPTIONS);
	// 	isVideo = false;
	// }
	// TODO: 只有图片格式
	measureEl = new Image();
	colors = await extractColors(imgURL, EXTRACT_COLORS_OPTIONS);

	measureEl.src = imgURL;

	// Handle disabled img info functionality or missing info block
	// let imgInfo = await getImgInfo(imgTFile.path, vault, metadata, plugin, false);
	let imgTags = null;

	let imgLinks: { path: string; name: string; }[] = [];
	// get all files!
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
			// isVideo: isVideo,
			// imgLinks: imgLinks,
			// frontmatter: imgInfoCache.frontmatter,
			infoList: infoList
		}
		// const reactComponent = React.createElement(GalleryInfo, props);
		//
		// // eslint-disable-next-line @typescript-eslint/no-explicit-any
		// ReactDOM.render(reactComponent, elCanvas);

		const root = createRoot(elCanvas);

		// TODO: TEST

		// const imgResources = getImageResources(imgTFile.path,
		// 	imgTFile.basename,
		// 	this.app.vault.getFiles(),
		// 	this.app.vault.adapter);
		//
		// console.log('Object.keys(imgResources)[0]', Object.keys(imgResources)[0]);
		const images = getImages(source);
		console.log('images', images)

// 在root上渲染React组件
		root.render(  <AppContext.Provider value={this.app}>
				<GalleryInfo {...props} />
			<ImageDisplay image={images[0]} plugin={plugin}/>
			{tags}
			</AppContext.Provider>);

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
