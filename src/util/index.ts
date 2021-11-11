import { CellValue } from "../contexts/times-table.context";

export function getCompletedQuestionsCount(cells: CellValue[]): number {
  return cells.filter((v) => typeof v.answer !== "undefined").length;
}

export function clamp(min: number, max: number) {
  return (value: number) => Math.max(Math.min(max, value), min);
}
