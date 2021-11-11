import { useState } from "react";

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
/**
 * Persist table settings between sessions.
 */
export function useSettings(): TableSettings {
  const key = "tableSettings";
  const [settings, setSettings] = useState<TableSettingsValue>(loadSettings);
  function loadSettings() {
    try {
      const savedValue = window.localStorage.getItem(key);
      if (savedValue) {
        const { width = 12, height = 12 } = JSON.parse(savedValue);
        return { width, height };
      }
    } catch (e) {
      // no need to do anything
    }
    return { width: 12, height: 12 };
  }
  function save(value: TableSettingsValue) {
    const newValue = value;
    window.localStorage.setItem(key, JSON.stringify(value));
    setSettings(newValue);
  }

  return { settings, save };
}
