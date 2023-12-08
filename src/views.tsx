import { ItemView, TFile, WorkspaceLeaf, debounce } from "obsidian";
// import Calendar from "react-github-contribution-calendar";
import { VIEW_DISPLAY_TEXT, VIEW_TYPE_JOURNALING } from "./constants";
import { createRoot, Root } from "react-dom/client";
import React from "react";
import TagCalendar from "./components/TagCalendar";
import {
  getAllDailyNotes,
  getDailyNote,
  getDateFromFile,
} from "obsidian-daily-notes-interface";
import { getJournalingData } from "./data/journalingData";
import { generateDateRange } from "./lib/utils";
import { JournalingDataProvider } from "./utils/JournalingContext";
import { IJournalingData } from "./types";
import moment, { Moment } from "moment";
import JournalingPlugin from "./main";

export default class JournalingView extends ItemView {
  private plugin: JournalingPlugin;
  private root: Root; // the root for rendering react components
  private journalingData: IJournalingData[] = [];

  constructor(leaf: WorkspaceLeaf, plugin: JournalingPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_JOURNALING;
  }

  getDisplayText(): string {
    return VIEW_DISPLAY_TEXT;
  }

  getIcon(): string {
    return "calendar-search";
  }

  async onOpen() {
    this.onFileCreated = this.onFileCreated.bind(this);
    this.onFileDeleted = this.onFileDeleted.bind(this);
    this.onFileModified = this.onFileModified.bind(this);
    this.onFileOpen = this.onFileOpen.bind(this);
    this.onSettingsUpdate = this.onSettingsUpdate.bind(this);

    this.openOrCreateDailyNote = this.openOrCreateDailyNote.bind(this);

    this.registerEvent(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.app.workspace as any).on(
        "obsidian-image-memo:settings-updated", // TODO: how to bind?
        this.onSettingsUpdate
      )
    );

    this.registerEvent(this.app.vault.on("create", this.onFileCreated));
    this.registerEvent(this.app.vault.on("delete", this.onFileDeleted));
    this.registerEvent(
      this.app.vault.on("modify", debounce(this.onFileModified, 1000, true))
    );
    this.registerEvent(this.app.workspace.on("file-open", this.onFileOpen));

    // TODO: responsive
    // this.registerEvent(
    //   this.app.workspace.on("resize", () => {
    //     this.handleResize();
    //   })
    // );

    this.root = createRoot(this.containerEl.children[1]);
    await this.updateJournalingData();
  }

  async onClose() {
    // ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
    this.root.unmount();
  }

  private onSettingsUpdate(): void {
    // TODO: update state
    this.renderReactComponent();
  }

  async updateJournalingData() {
    this.journalingData =
      (await getJournalingData(
        this.app,
        generateDateRange(
          moment()
            .subtract(this.plugin.settings.dateRange, "days")
            .format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD")
        )
      )) || [];

    // update the react component
    this.renderReactComponent();
  }

  private async onFileCreated(file: TFile): Promise<void> {
    if (this.app.workspace.layoutReady) {
      if (getDateFromFile(file, "day")) {
        await this.updateJournalingData();
      }
    }
  }
  private async onFileDeleted(file: TFile): Promise<void> {
    if (getDateFromFile(file, "day")) {
      await this.updateJournalingData();
    }
  }
  private async onFileModified(file: TFile): Promise<void> {
    if (getDateFromFile(file, "day")) {
      await this.updateJournalingData();
    }
  }
  private async onFileOpen(file: TFile): Promise<void> {
    if (getDateFromFile(file, "day")) {
      await this.updateJournalingData();
    }
  }

  async openOrCreateDailyNote(
    date: Moment,
    inNewSplit: boolean
  ): Promise<void> {
    const { workspace } = this.app;
    const existingFile = getDailyNote(date, getAllDailyNotes());
    if (!existingFile) {
      // just return
      // TODO: add an alert?
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mode = (this.app.vault as any).getConfig("defaultViewMode");
    const leaf = workspace.getLeaf(inNewSplit);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await leaf.openFile(existingFile, { active: true, mode });

    // FIXME: I haven't set activeFile yet
    // activeFile.setFile(existingFile);
  }

  renderReactComponent() {
    this.root.render(
      <React.StrictMode>
        <JournalingDataProvider>
          <TagCalendar
            data={this.journalingData}
            settings={this.plugin.settings}
            onClickDay={this.openOrCreateDailyNote}
          />
        </JournalingDataProvider>
      </React.StrictMode>
    );
  }
}
