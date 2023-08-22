import { App, ItemView, TFile, WorkspaceLeaf } from "obsidian";
// import Calendar from "react-github-contribution-calendar";
import { VIEW_DISPLAY_TEXT, VIEW_TYPE_JOURNALING } from "./constants";
import { createRoot } from "react-dom/client";
import React from "react";
import TagCalendar from "./components/TagCalendar";
import ReactDOM from "react-dom";
import {
  getAllDailyNotes,
  getDailyNote,
  getDateFromFile,
} from "obsidian-daily-notes-interface";
import { getJournalingData } from "./data/journalingData";
import { generateDateRange } from "./lib/utils";
import { JournalingDataProvider } from "./utils/JournalingContext";
import { IJournalingData } from "./types";
import { Moment } from "moment";
import JournalingPlugin from "./main";

export default class JournalingView extends ItemView {
  // app: App;
  private plugin: JournalingPlugin;
  private root: any;
  private journalingData: IJournalingData[] = [];
  // private calendar: Calendar;

  constructor(leaf: WorkspaceLeaf, private plugin: JournalingPlugin) {
    super(leaf);
    this.plugin = plugin;

    this.onFileCreated = this.onFileCreated.bind(this);
    this.onFileDeleted = this.onFileDeleted.bind(this);
    this.onFileModified = this.onFileModified.bind(this);
    this.onFileOpen = this.onFileOpen.bind(this);

    this.openOrCreateDailyNote = this.openOrCreateDailyNote.bind(this);

    // this.registerEvent(
    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // (this.app.workspace as any).on(
    //   "periodic-notes:settings-updated",
    //   this.onNoteSettingsUpdate
    //   )
    //   );
    this.registerEvent(this.app.vault.on("create", this.onFileCreated));
    this.registerEvent(this.app.vault.on("delete", this.onFileDeleted));
    this.registerEvent(this.app.vault.on("modify", this.onFileModified));
    this.registerEvent(this.app.workspace.on("file-open", this.onFileOpen));
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
    this.root = createRoot(this.containerEl.children[1]);
    await this.updateJournalingData();
    // 在这个部分处理数据逻辑,并传入到TagCalendar组件中
    // 需要获取每天日记中的图片+标签数量
    // 获取的应该是[{date: [{tag: xxx, number: xxx}, {tag: xxx, number: xxx}]}]
    // TODO: 需要实时更新
    // const data = await getJournalingData(
    //   this.app,
    //   generateDateRange("2023-08-01", "2023-08-20")
    // );
    // console.log(data);
    // const values = {
    //   "2016-06-23": 1,
    //   "2016-06-26": 2,
    //   "2016-06-27": 3,
    //   "2016-06-28": 4,
    //   "2016-06-29": 4,
    // };
    await this.updateJournalingData();
  }

  async onClose() {
    ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
  }

  async updateJournalingData() {
    this.journalingData =
      (await getJournalingData(
        this.app,
        generateDateRange("2023-08-15", "2023-08-31")
      )) || [];

    // console.log('journalingData', this.journalingData);

    // 更新React组件
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
    const leaf = inNewSplit
      ? workspace.splitActiveLeaf()
      : workspace.getUnpinnedLeaf();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await leaf.openFile(existingFile, { active: true, mode });

    // FIXME: I haven't set activeFile yet
    // activeFile.setFile(existingFile);
  }

  renderReactComponent() {
    console.log("settings2", this.plugin.settings);
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
