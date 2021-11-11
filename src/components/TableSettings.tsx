import { DialogContent, DialogOverlay } from "@reach/dialog";
import React, { FormEvent, useCallback, useRef } from "react";
import { useTimesTable } from "../contexts/times-table.context";
import { clamp, getCompletedQuestionsCount } from "../util";
import { useSettings } from "../hooks/use-settings";

export interface TableSettingsProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export function TableSettings({ isOpen, onDismiss }: TableSettingsProps) {
  const { reset, cells, rows, cols } = useTimesTable();
  const formRef = useRef<HTMLFormElement>(null);
  function onSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!formRef.current) {
      return;
    }
    const completedQuestionsCount = getCompletedQuestionsCount(cells);
    if (
      completedQuestionsCount !== 0 &&
      completedQuestionsCount !== rows.length * cols.length
    ) {
      const shouldUpdateSettings = confirm(
        "You have unanswered questions. Updating your settings will reset the board. Continue?"
      );
      if (!shouldUpdateSettings) {
        return;
      }
    }
    const formData = new FormData(formRef.current);
    const constrain = clamp(6, 24);
    const height = constrain(Number(formData.get("height")));
    const width = constrain(Number(formData.get("width")));
    reset({ height, width });
    onDismiss();
  }

  return !isOpen ? null : (
    <DialogOverlay aria-label="Table Settings">
      <DialogContent style={{ maxWidth: "300px" }} aria-label="Table Settings">
        <h1 className="text-xl mb-4" tabIndex={-1}>
          Settings
        </h1>
        <form ref={formRef} onSubmit={onSubmit}>
          <div className="mb-2">
            <label htmlFor="width" className="w-16 inline-block">
              Width
            </label>
            <input
              type="number"
              name="width"
              min={6}
              max={24}
              id="width"
              className="border px-1 py-2 rounded w-16 text-center"
              defaultValue={cols.length}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="height" className="w-16 inline-block">
              Height
            </label>
            <input
              type="number"
              min={6}
              max={24}
              name="height"
              id="height"
              className="border px-1 py-2 rounded w-16 text-center"
              defaultValue={rows.length}
            />
          </div>
          <button
            className="rounded border-2 border-blue-900 bg-blue-900 text-white font-bold px-2 py-1 w-full mb-2"
            type="submit"
          >
            Save
          </button>
          <button
            className="rounded border-2 border-blue-900 bg-white text-blue-900 font-bold px-2 py-1 w-full"
            onClick={onDismiss}
          >
            Cancel
          </button>
        </form>
      </DialogContent>
    </DialogOverlay>
  );
}
