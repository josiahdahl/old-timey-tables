import { useCallback } from "react";
import { ArrowKeyHandler, useArrowKeys } from "../hooks/use-arrow-keys";
import { useTimesTable } from "../contexts/times-table.context";

export function KeyboardControls() {
  const { rows, cols, focusCell, focusedCell } = useTimesTable();
  const arrowKeyHandler = useCallback<ArrowKeyHandler>(
    (direction) => {
      const width = cols.length;
      const height = rows.length;
      switch (direction) {
        case "ArrowUp": {
          if (focusedCell >= width) {
            // move up a row
            focusCell(focusedCell - width);
          } else {
            // wrap to the bottom
            focusCell(width * height - 1 - (width - 1 - focusedCell));
          }
          break;
        }
        case "ArrowDown": {
          if (focusedCell <= width * (height - 1) - 1) {
            // move down
            focusCell(focusedCell + width);
          } else {
            // wrap to the top
            focusCell(focusedCell % width);
          }
          break;
        }
        case "ArrowLeft": {
          if (focusedCell % width !== 0) {
            focusCell(focusedCell - 1);
          } else {
            // wrap to right side
            focusCell(focusedCell + width - 1);
          }
          break;
        }
        case "ArrowRight": {
          if (focusedCell % width !== width - 1) {
            focusCell(focusedCell + 1);
          } else {
            // wrap to left side
            focusCell(focusedCell - width + 1);
          }
          break;
        }
      }
    },
    [rows, cols, focusedCell]
  );
  useArrowKeys(arrowKeyHandler);

  return null;
}
