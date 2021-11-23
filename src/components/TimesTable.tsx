import { FormEvent, useEffect, useRef } from "react";
import { CellContent } from "./CellContent";
import { InputCell } from "./InputCell";
import "@reach/dialog/styles.css";
import { useOnClickOutside } from "../hooks/use-click-outside";
import {
  TimesTableState,
  useTimesTable,
} from "../contexts/times-table.context";
import { getCompletedQuestionsCount } from "../util";

export interface TimesTableProps {
  showResults: () => void;
}

export function TimesTable({ showResults }: TimesTableProps) {
  const { rows, cols, cells, reset, validate, state, focusCell, focusedCell } =
    useTimesTable();
  const width = cols.length || 12;
  const height = rows.length || 12;
  const tableRef = useRef(null);
  useOnClickOutside(tableRef, () => {
    focusCell(-1);
  });
  const beforeUnloadRef = useRef<undefined | ((e: BeforeUnloadEvent) => void)>(
    undefined
  );
  const completedQuestionsCount = getCompletedQuestionsCount(cells);
  const selectedX = focusedCell % width;
  const selectedY = Math.floor(focusedCell / width);
  useEffect(() => {
    if (beforeUnloadRef.current) {
      window.removeEventListener("beforeunload", beforeUnloadRef.current);
    }
    beforeUnloadRef.current = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      if (state === TimesTableState.ANSWERING && completedQuestionsCount > 0) {
        const leavePage = confirm("Are you sure you want to leave?");
        if (!leavePage) {
          e.returnValue = "";
        } else {
          delete e["returnValue"];
        }
      }
      delete e["returnValue"];
    };
    window.addEventListener("beforeunload", beforeUnloadRef.current);
    return () => {
      if (beforeUnloadRef.current) {
        window.removeEventListener("beforeunload", beforeUnloadRef.current);
      }
    };
  }, [state]);

  function validateAnswers(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (completedQuestionsCount !== rows.length * cols.length) {
      const shouldValidate = confirm(
        "You have unanswered questions. Really check answers?"
      );
      if (!shouldValidate) {
        return;
      }
    }
    validate();
    showResults();
  }

  function handleReset() {
    if (
      state !== TimesTableState.VALIDATED &&
      completedQuestionsCount > 0 &&
      completedQuestionsCount !== rows.length * cols.length
    ) {
      const shouldReset = confirm(
        "You have unanswered questions. Really reset?"
      );
      if (!shouldReset) {
        return;
      }
    }
    reset({ width, height });
  }

  return rows.length === 0 ? null : (
    <form onSubmit={validateAnswers}>
      <table ref={tableRef}>
        <thead>
          <tr>
            <th />
            {cols.map((col, colIdx) => (
              <th className="border" key={col}>
                <CellContent isHighlighted={selectedX === colIdx}>
                  {col}
                </CellContent>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={row}>
              <td className="border">
                <CellContent isHighlighted={selectedY === rowIdx}>
                  <strong>{row}</strong>
                </CellContent>
              </td>
              {cols.map((col, colIdx) => {
                return (
                  <td key={`${col}-${row}`} className="border">
                    <InputCell xIdx={colIdx} yIdx={rowIdx} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center py-4">
        {state === TimesTableState.ANSWERING ? (
          <button
            className="rounded border-2 border-blue-900 bg-blue-900 text-white font-bold px-2 py-1 mr-4"
            type="submit"
          >
            Check Answers
          </button>
        ) : (
          <button
            className="rounded border-2 border-blue-900 bg-blue-900 text-white font-bold px-2 py-1 mr-4"
            type="button"
            onClick={showResults}
          >
            View Results
          </button>
        )}
        <button
          className="border-2 border-transparent bg-transparent text-blue-900 font-bold px-2 py-1"
          type="reset"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </form>
  );
}
