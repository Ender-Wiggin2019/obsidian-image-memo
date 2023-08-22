import { App, PluginSettingTab, Setting } from "obsidian";
import { appHasDailyNotesPluginLoaded } from "obsidian-daily-notes-interface";
import type { ILocaleOverride, IWeekStartOption } from "obsidian-calendar-ui";

import { DEFAULT_RANGE } from "src/constants";

import type JournalingPlugin from "./main";
import { Color } from "react-activity-calendar";

export interface ISettings {
  dateRange: number;
  fromColor: Color;
  toColor: Color;
  blockSize: number;
  blockRadius: number;
  fontSize: number;
  hideMonthLabels: boolean;
  showWeekdayLabels: boolean;
  weekStart: IWeekStartOption;
  localeOverride: ILocaleOverride;

  // localeOverride: ILocaleOverride;
}

const weekdays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const defaultSettings = Object.freeze({
  dateRange: DEFAULT_RANGE,
  fromColor: "#EEEEEE",
  toColor: "#1E6823",
  blockSize: 16,
  blockRadius: 2,
  fontSize: 14,
  hideMonthLabels: false,
  showWeekdayLabels: false,
  weekStart: "monday",
  localeOverride: "system-default",
});

export function appHasPeriodicNotesPluginLoaded(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const periodicNotes = (<any>window.app).plugins.getPlugin("periodic-notes");
  return periodicNotes && periodicNotes.settings?.weekly?.enabled;
}

export class JournalingSettingsTab extends PluginSettingTab {
  private plugin: JournalingPlugin;

  constructor(app: App, plugin: JournalingPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    this.containerEl.empty();

    if (!appHasDailyNotesPluginLoaded()) {
      this.containerEl.createDiv("settings-banner", (banner) => {
        banner.createEl("h3", {
          text: "⚠️ Daily Notes plugin not enabled",
        });
        banner.createEl("p", {
          cls: "setting-item-description",
          text: "This plugin is best used in conjunction with either the Daily Notes plugin or the Periodic Notes plugin (available in the Community Plugins catalog).",
        });
      });
    }

    this.containerEl.createEl("h3", {
      text: "General Settings",
    });
    this.addDateRangeSetting();
    this.addFromColorSetting();
    this.addToColorSetting();
    this.addBlockSizeSetting();
    this.addBlockRadiusSetting();
    this.addFontSizeSetting();
    this.addHideMonthLabelsSetting();
    this.addShowWeekdayLabelsSetting();
    this.addWeekStartSetting();

    // if (
    // 	this.plugin.settings.showWeeklyNote &&
    // 	!appHasPeriodicNotesPluginLoaded()
    // ) {
    // 	this.containerEl.createEl("h3", {
    // 		text: "Weekly Note Settings",
    // 	});
    // 	this.containerEl.createEl("p", {
    // 		cls: "setting-item-description",
    // 		text:
    // 			"Note: Weekly Note settings are moving. You are encouraged to install the 'Periodic Notes' plugin to keep the functionality in the future.",
    // 	});
    // 	this.addWeeklyNoteFormatSetting();
    // 	this.addWeeklyNoteTemplateSetting();
    // 	this.addWeeklyNoteFolderSetting();
    // }

    this.containerEl.createEl("h3", {
      text: "Advanced Settings",
    });
    this.addLocaleOverrideSetting();
  }

  addDateRangeSetting(): void {
    new Setting(this.containerEl)
      .setName("Date range")
      .setDesc("How many days to show in the calendar")
      .addText((textField) => {
        textField.setPlaceholder(String(DEFAULT_RANGE));
        textField.inputEl.type = "number";
        textField.setValue(String(this.plugin.settings.dateRange));
        textField.onChange(async (value) => {
          this.plugin.settings.dateRange = Number(value);
          await this.plugin.saveSettings();
        });
      });
  }

  addFromColorSetting(): void {
    new Setting(this.containerEl)
      .setName("Color scale start")
      .setDesc("The color of the least tags in the calendar")
      .addColorPicker((colorPicker) => {
        colorPicker.setValue(this.plugin.settings.fromColor);
        colorPicker.onChange(async (value) => {
          this.plugin.settings.fromColor = value;
          await this.plugin.saveSettings();
        });
      });
  }

  addToColorSetting(): void {
    new Setting(this.containerEl)
      .setName("Color scale end")
      .setDesc("The color of the most tags in the calendar")
      .addColorPicker((colorPicker) => {
        colorPicker.setValue(this.plugin.settings.toColor);
        colorPicker.onChange(async (value) => {
          this.plugin.settings.toColor = value;
          await this.plugin.saveSettings();
        });
      });
  }

  addBlockSizeSetting(): void {
    new Setting(this.containerEl)
      .setName("Block size")
      .setDesc("The size of each block in the calendar, in pixels")
      .addSlider((slider) => {
        slider.setValue(this.plugin.settings.blockSize);
        slider.setLimits(10, 30, 1);
        slider.showTooltip();
        slider.onChange(async (value) => {
          this.plugin.settings.blockSize = value;
          slider.showTooltip();
          await this.plugin.saveSettings();
        });
      });
  }

  addBlockRadiusSetting(): void {
    new Setting(this.containerEl)
      .setName("Block radius")
      .setDesc("The radius of each block in the calendar, in pixels")
      .addSlider((slider) => {
        slider.setValue(this.plugin.settings.blockRadius);
        slider.setLimits(0, 10, 1);
        slider.showTooltip();
        slider.onChange(async (value) => {
          this.plugin.settings.blockRadius = value;
          slider.showTooltip();
          await this.plugin.saveSettings();
        });
      });
  }

  addFontSizeSetting(): void {
    new Setting(this.containerEl)
      .setName("Font size")
      .setDesc("The font size of the calendar")
      .addSlider((slider) => {
        slider.setValue(this.plugin.settings.fontSize);
        slider.setLimits(10, 30, 1);
        slider.showTooltip();
        slider.onChange(async (value) => {
          this.plugin.settings.fontSize = value;
          slider.showTooltip();
          await this.plugin.saveSettings();
        });
      });
  }

  addHideMonthLabelsSetting(): void {
    new Setting(this.containerEl)
      .setName("Hide month labels")
      .setDesc("Hide the month labels in the calendar")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.hideMonthLabels);
        toggle.onChange(async (value) => {
          this.plugin.settings.hideMonthLabels = value;
          await this.plugin.saveSettings();
        });
      });
  }

  addShowWeekdayLabelsSetting(): void {
    new Setting(this.containerEl)
      .setName("Show weekday labels")
      .setDesc("Show the weekday labels in the calendar")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.showWeekdayLabels);
        toggle.onChange(async (value) => {
          this.plugin.settings.showWeekdayLabels = value;
          await this.plugin.saveSettings();
        });
      });
  }

  addWeekStartSetting(): void {
    const { moment } = window;

    const localizedWeekdays = moment.weekdays();
    const localeWeekStartNum = window._bundledLocaleWeekSpec.dow;
    const localeWeekStart = moment.weekdays()[localeWeekStartNum];

    new Setting(this.containerEl)
      .setName("Start week on:")
      .setDesc(
        "Choose what day of the week to start. Select 'Locale default' to use the default specified by moment.js"
      )
      .addDropdown((dropdown) => {
        dropdown.addOption("locale", `Locale default (${localeWeekStart})`);
        localizedWeekdays.forEach((day, i) => {
          dropdown.addOption(weekdays[i], day);
        });
        dropdown.setValue(this.plugin.settings.weekStart);
        dropdown.onChange(async (value) => {
          this.plugin.settings.weekStart = value as IWeekStartOption;
          await this.plugin.saveSettings();
        });
      });
  }

  addLocaleOverrideSetting(): void {
    const { moment } = window;

    const sysLocale = navigator.language?.toLowerCase();

    new Setting(this.containerEl)
      .setName("Override locale:")
      .setDesc(
        "Set this if you want to use a locale different from the default"
      )
      .addDropdown((dropdown) => {
        dropdown.addOption("system-default", `Same as system (${sysLocale})`);
        moment.locales().forEach((locale) => {
          dropdown.addOption(locale, locale);
        });
        dropdown.setValue(this.plugin.settings.localeOverride);
        dropdown.onChange(async (value) => {
          this.plugin.settings.localeOverride = value as string;
          await this.plugin.saveSettings();
        });
      });
  }
}
