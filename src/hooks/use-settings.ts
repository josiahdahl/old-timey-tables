import { useState } from "react";
import { clampWidthHeight } from "../util";

export interface TableSettingsValue {
  width: number;
  height: number;
}

export interface TableSettingsFunctions {
  save(value: TableSettingsValue): void;
}

export type TableSettings = {
  settings: TableSettingsValue;
} & TableSettingsFunctions;

function settingsFromLocalStorage(key: string): any {
  try {
    const savedValue = window.localStorage.getItem(key);
    if (savedValue) {
      return JSON.parse(savedValue);
    }
  } catch (e) {
    // no need to do anything
  }
  return { width: 12, height: 12 };
}

function saveToLocalStorage(key: string, value: TableSettingsValue) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function saveToQueryParams(value: TableSettingsValue) {
  const params = new URLSearchParams();
  params.set("height", value.height.toString());
  params.set("width", value.width.toString());
  window.history.replaceState(null, "", `?${params.toString()}`);
}

function settingsFromParams() {
  const params = new URLSearchParams(window.location.search);
  const parsed = {
    width: Number(params.get("width")),
    height: Number(params.get("height")),
  };
  if (
    Number.isNaN(parsed.width) ||
    Number.isNaN(parsed.height) ||
    parsed.width === 0 ||
    parsed.height === 0
  ) {
    return undefined;
  }
  return clampWidthHeight(parsed);
}

/**
 * Persist table settings between sessions.
 */
export function useSettings(): TableSettings {
  const key = "tableSettings";
  const [settings, setSettings] = useState<TableSettingsValue>(loadSettings);
  function loadSettings() {
    const fromParams = settingsFromParams();
    if (typeof fromParams !== "undefined") {
      saveToLocalStorage(key, fromParams);
      return fromParams;
    }
    const { width = 12, height = 12 } = settingsFromLocalStorage(key);

    return clampWidthHeight({ width, height });
  }
  function save(value: TableSettingsValue) {
    saveToLocalStorage(key, value);
    saveToQueryParams(value);
    setSettings({ ...value });
  }

  return { settings, save };
}
