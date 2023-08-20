import { App, ItemView, TFile, WorkspaceLeaf } from "obsidian";
// import Calendar from "react-github-contribution-calendar";
import { VIEW_DISPLAY_TEXT, VIEW_TYPE_CALENDAR } from "./constants";
import { createRoot } from "react-dom/client";
import React from "react";
import TagCalendar from "./components/TagCalendar";
import ReactDOM from "react-dom";
import { getDateFromFile } from "obsidian-daily-notes-interface";
import { getJournalingData } from "./data/journalingData";
import JournalingPlugin from "./main";
import { generateDateRange } from "./lib/utils";
import { JournalingDataProvider } from "./utils/JournalingContext";
import { IJournalingData } from "./types";

export default class JournalingView extends ItemView {
  plugin: JournalingPlugin;
  // app: App;
  private root: any;
  private journalingData: IJournalingData[] = [];
  // private calendar: Calendar;

  constructor(leaf: WorkspaceLeaf, plugin: JournalingPlugin) {
    super(leaf);
    // this.app = app;
    this.plugin = plugin;
    // this.onNoteSettingsUpdate = this.onNoteSettingsUpdate.bind(this);
    this.onFileCreated = this.onFileCreated.bind(this);
    this.onFileDeleted = this.onFileDeleted.bind(this);
    this.onFileModified = this.onFileModified.bind(this);
    this.onFileOpen = this.onFileOpen.bind(this);

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
    return VIEW_TYPE_CALENDAR;
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
        // 如果是日记文件，则更新数据并重新渲染
        await this.updateJournalingData();
      }
      // 如果你还想对其他文件类型做特定操作，可以在此处添加其他条件语句
    }
  }
  private async onFileDeleted(file: TFile): Promise<void> {
    if (getDateFromFile(file, "day")) {
      // 如果是日记文件，则更新数据并重新渲染
      await this.updateJournalingData();
    }
    // 如果你还想对其他文件类型做特定操作，可以在此处添加其他条件语句
  }
  private async onFileModified(file: TFile): Promise<void> {
    if (getDateFromFile(file, "day")) {
      // 如果是日记文件，则更新数据并重新渲染
      await this.updateJournalingData();
    }
    // 如果你还想对其他文件类型做特定操作，可以在此处添加其他条件语句
  }
  private async onFileOpen(file: TFile): Promise<void> {
    if (getDateFromFile(file, "day")) {
      // 如果是日记文件，则更新数据并重新渲染
      await this.updateJournalingData();
    }
  }

  renderReactComponent() {
    this.root.render(
      <React.StrictMode>
        <JournalingDataProvider>
          <TagCalendar data={this.journalingData} until={"2023-08-31"} />
        </JournalingDataProvider>
      </React.StrictMode>
    );
  }
}
