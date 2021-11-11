import { CellValue } from "../contexts/times-table.context";
import { TableSettingsValue } from "../hooks/use-settings";

export function getCompletedQuestionsCount(cells: CellValue[]): number {
  return cells.filter((v) => typeof v.answer !== "undefined").length;
}

export function clamp(min: number, max: number) {
  return (value: number) => Math.max(Math.min(max, value), min);
}

export function clampWidthHeight(settings: TableSettingsValue) {
  const constrain = clamp(6, 24);
  const { width, height } = settings;
  return { width: constrain(width), height: constrain(height) };
}
