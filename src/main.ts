import { Plugin, WorkspaceLeaf } from "obsidian";
import { imageInfo } from "./ImageInfo";
import JournalingView from "./views";
import { defaultSettings, ISettings, JournalingSettingsTab } from "./settings";
import { VIEW_TYPE_JOURNALING } from "./constants";

export default class JournalingPlugin extends Plugin {
  public settings: ISettings; // settings for the plugin

  onunload(): void {
    //Don't detach leaves https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines#Don't+detach+leaves+in+%60onunload%60
  }

  async onload(): Promise<void> {
    await this.loadSettings();
    this.registerView(
      VIEW_TYPE_JOURNALING,
      (leaf: WorkspaceLeaf) => new JournalingView(leaf, this)
    );

    // Register image info block
    this.registerMarkdownCodeBlockProcessor(
      "imemo",
      async (source, el, _ctx) => {
        imageInfo(source, el, this.app.vault, this);
      }
    );

    this.addSettingTab(new JournalingSettingsTab(this.app, this));
    this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
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
