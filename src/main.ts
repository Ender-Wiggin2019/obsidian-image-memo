import { Plugin, WorkspaceLeaf } from "obsidian";
import { imageInfo } from "./ImageInfo";
import JournalingView from "./views";
import { defaultSettings, ISettings, JournalingSettingsTab } from "./settings";
import { VIEW_TYPE_JOURNALING } from "./constants";

export default class JournalingPlugin extends Plugin {
  private view: JournalingView; // the view to display tag calendar
  public settings: ISettings; // settings for the plugin

  onunload(): void {
    // unload view
    this.app.workspace
      .getLeavesOfType(VIEW_TYPE_JOURNALING)
      .forEach((leaf) => leaf.detach());
  }

  async onload(): Promise<void> {
    await this.loadSettings();
    this.registerView(
      VIEW_TYPE_JOURNALING,
      (leaf: WorkspaceLeaf) => (this.view = new JournalingView(leaf, this))
    );

    // Register image info block
    this.registerMarkdownCodeBlockProcessor(
      "imemo",
      async (source, el, _ctx) => {
        // imageInfo(source, el, this.app.vault, this.app.metadataCache, this);
        imageInfo(source, el, this.app.vault, this);
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
    // update calendar
    if (this.view) await this.view.renderReactComponent();
  }
}
