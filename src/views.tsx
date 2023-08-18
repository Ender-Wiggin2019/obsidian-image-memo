import { App, ItemView, WorkspaceLeaf } from "obsidian";
// import Calendar from "react-github-contribution-calendar";
import { VIEW_DISPLAY_TEXT, VIEW_TYPE_CALENDAR } from "./constants";
import { createRoot } from "react-dom/client";
import React from "react";
import TagCalendar from "./components/TagCalendar";
import ReactDOM from "react-dom";
import type { Moment } from "moment";
import {
  getDailyNote,
  getDailyNoteSettings,
  getDateFromFile,
  getWeeklyNote,
  getWeeklyNoteSettings,
} from "obsidian-daily-notes-interface";
import { NotesProvider } from "./utils/NoteContext";
import { getJournalingData } from "./data/journalingData";
import JournalingPlugin from "./main";
import { generateDateRange } from "./lib/utils";
export default class JournalingView extends ItemView {
  plugin: JournalingPlugin;
  app: App;
  // private calendar: Calendar;

  constructor(leaf: WorkspaceLeaf, app: App, plugin: JournalingPlugin) {
    super(leaf);
    this.app = app;
    this.plugin = plugin;
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
    const root = createRoot(this.containerEl.children[1]);
    // 在这个部分处理数据逻辑,并传入到TagCalendar组件中
    // 需要获取每天日记中的图片+标签数量
    // 获取的应该是[{date: [{tag: xxx, number: xxx}, {tag: xxx, number: xxx}]}]
    // TODO: 需要实时更新
    const data = await getJournalingData(
      app,
      generateDateRange("2023-08-01", "2023-08-20")
    );
    console.log(data);
    const values = {
      "2016-06-23": 1,
      "2016-06-26": 2,
      "2016-06-27": 3,
      "2016-06-28": 4,
      "2016-06-29": 4,
    };
    root.render(
      <React.StrictMode>
        <NotesProvider>
          <TagCalendar values={values} until={"2016-06-29"} />
        </NotesProvider>
      </React.StrictMode>
    );
  }

  async onClose() {
    ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
  }
}
