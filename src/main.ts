import { ItemView, Plugin, WorkspaceLeaf } from "obsidian";
import React from "react";
import ReactDOM from "react-dom";

import DiceRoller from "./ui/DicerRoller";
import { JournalingSettings } from "./types";
import { imageInfo } from "./ImageInfo";
const VIEW_TYPE = "react-view";

class MyReactView extends ItemView {
  private reactComponent: React.ReactElement;

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return "Dice Roller";
  }

  getIcon(): string {
    return "calendar-with-checkmark";
  }

  async onOpen(): Promise<void> {
    this.reactComponent = React.createElement(DiceRoller);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ReactDOM.render(this.reactComponent, (this as any).contentEl);
  }
}

export default class JournalingPlugin extends Plugin {
  private view: MyReactView;
  public settings: JournalingSettings;


	async onload(): Promise<void> {
    console.log("start!");
    this.registerView(
      VIEW_TYPE,
      (leaf: WorkspaceLeaf) => (this.view = new MyReactView(leaf))
    );

    // Register image info block
    this.registerMarkdownCodeBlockProcessor(
      "journaling",
      async (source, el, ctx) => {
		  imageInfo(source, el, this.app.vault, this.app.metadataCache, this);
	  }
    );

    this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
  }

  onLayoutReady(): void {
    if (this.app.workspace.getLeavesOfType(VIEW_TYPE).length) {
      return;
    }
    this.app.workspace.getRightLeaf(false).setViewState({
      type: VIEW_TYPE,
    });
  }
}
