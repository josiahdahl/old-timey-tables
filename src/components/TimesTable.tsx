import { FormEvent, useEffect, useRef } from "react";
import { CellContent } from "./CellContent";
import { InputCell } from "./InputCell";
import "@reach/dialog/styles.css";
import { useOnClickOutside } from "../hooks/use-click-outside";
import { TimesTableState, useTimesTable } from "../contexts/times-table.context";

export interface TableProps {
  width: number;
  height: number;
}

export function TimesTable({ width, height }: TableProps) {
  const { rows, cols, cells, reset, validate, state, focusCell, focusedCell } =
    useTimesTable();
  const tableRef = useRef(null);
  useOnClickOutside(tableRef, () => {
    focusCell(-1);
  });
  const beforeUnloadRef = useRef<undefined | ((e: BeforeUnloadEvent) => void)>(
    undefined
  );
  const completedQuestions = cells.filter(
    (v) => typeof v.answer !== "undefined"
  );
  const selectedX = focusedCell % width;
  const selectedY = Math.floor(focusedCell / width);
  useEffect(() => {
    if (beforeUnloadRef.current) {
      window.removeEventListener("beforeunload", beforeUnloadRef.current);
    }
    beforeUnloadRef.current = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      if (
        state === TimesTableState.ANSWERING &&
        completedQuestions.length > 0
      ) {
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
    if (completedQuestions.length !== rows.length * cols.length) {
      const shouldValidate = confirm(
        "You have unanswered questions. Really check answers?"
      );
      if (!shouldValidate) {
        return;
      }
    }
    validate();
  }

  function handleReset() {
    reset(width, height);
  }

  useEffect(() => {
    if (state === TimesTableState.ANSWERING) {
      handleReset();
    }
  }, [state]);

  return rows.length === 0 ? null : (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <header className="mb-4 text-center">
        <h1 className="text-2xl font-bold">Times Tables</h1>
        <p>Enter answers below and then check them!</p>
      </header>
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
          <button
            className="rounded border-2 border-blue-900 bg-blue-900 text-white font-bold px-2 py-1 mr-4"
            type="submit"
          >
            Check Answers
          </button>
          <button
            className="border-2 border-transparent bg-transparent text-blue-900 font-bold px-2 py-1"
            type="reset"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>
    </main>
  );
}
