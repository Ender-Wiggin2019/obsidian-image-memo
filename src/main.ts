import { App, ItemView, Plugin, WorkspaceLeaf } from "obsidian";
import React from "react";
import ReactDOM from "react-dom";

import DiceRoller from "./components/DicerRoller";
import { JournalingSettings } from "./types";
import { imageInfo } from "./ImageInfo";
import JournalingView from "./views";
import { defaultSettings, ISettings, JournalingSettingsTab } from "./settings";
import { Moment, WeekSpec } from "moment";
import { VIEW_TYPE_JOURNALING } from "./constants";

declare global {
  interface Window {
    app: App;
    moment: () => Moment;
    _bundledLocaleWeekSpec: WeekSpec;
  }
}

export default class JournalingPlugin extends Plugin {
  // private view: MyReactView;
  private view: JournalingView;
  public settings: ISettings;

  onunload(): void {
    // unload view
    this.app.workspace
      .getLeavesOfType(VIEW_TYPE_JOURNALING)
      .forEach((leaf) => leaf.detach());
  }

  async onload(): Promise<void> {
    await this.loadSettings();
    console.log("settings", this.settings);
    console.log("Loaded Journaling Plugin");
    this.registerView(
      VIEW_TYPE_JOURNALING,
      (leaf: WorkspaceLeaf) => (this.view = new JournalingView(leaf, this))
    );

    // Register image info block
    this.registerMarkdownCodeBlockProcessor(
      "journaling",
      async (source, el, _ctx) => {
        imageInfo(source, el, this.app.vault, this.app.metadataCache, this);
      }
    );

    this.addSettingTab(new JournalingSettingsTab(this.app, this));

    if (this.app.workspace.layoutReady) {
      this.initLeaf();
    } else {
      this.registerEvent(
        this.app.workspace.on("layout-ready", this.initLeaf.bind(this))
      );
    }

    this.saveSettings();

    this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
  }

  initLeaf(): void {
    if (this.app.workspace.getLeavesOfType(VIEW_TYPE_JOURNALING).length) {
      return;
    }
    this.app.workspace.getRightLeaf(false).setViewState({
      type: VIEW_TYPE_JOURNALING,
    });
  }
  onLayoutReady(): void {
    if (this.app.workspace.getLeavesOfType(VIEW_TYPE_JOURNALING).length) {
      return;
    }
    this.app.workspace.getRightLeaf(false).setViewState({
      type: VIEW_TYPE_JOURNALING,
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, defaultSettings, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
