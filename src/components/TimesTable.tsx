import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { CellContent } from "./CellContent";
import { InputCell } from "./InputCell";
import { TimesTableState } from "../hooks/use-times-table";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import { useOnClickOutside } from "../hooks/use-click-outside";
import { useTimesTable } from "../contexts/times-table.context";
import { ArrowKeyHandler, useArrowKeys } from "../hooks/use-arrow-keys";

export interface TableProps {
  width: number;
  height: number;
}

export function TimesTable({ width, height }: TableProps) {
  const {
    rows,
    cols,
    cells,
    reset,
    validate,
    idSeed,
    state,
    focusCell,
    focusedCell,
  } = useTimesTable();
  const [modalOpen, setModalOpen] = useState(false);
  const tableRef = useRef(null);
  useOnClickOutside(tableRef, () => {
    focusedCell(-1);
  });
  const arrowKeyHandler = useCallback<ArrowKeyHandler>(
    (direction) => {
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
    [width, height, focusedCell]
  );
  useArrowKeys(arrowKeyHandler);

  const showModal = () => setModalOpen(true);
  const hideModal = () => setModalOpen(false);

  function validateAnswers(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    validate();
    showModal();
  }
  function handleReset() {
    reset(width, height);
  }

  useEffect(() => {
    if (state === TimesTableState.ANSWERING) {
      handleReset();
    }
  }, [state]);

  const completedQuestions = cells.filter(
    (v) => typeof v.answer !== "undefined"
  );
  const correctQuestions = completedQuestions.filter((v) => v.isCorrect);
  const selectedX = focusedCell % width;
  const selectedY = Math.floor(focusedCell / width);

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
      <Dialog
        isOpen={modalOpen}
        onDismiss={hideModal}
        aria-label="Times Table Results"
      >
        <div className="text-xl text-center">
          <p>
            Completed{" "}
            <strong>
              {completedQuestions.length} / {rows.length * cols.length}
            </strong>
          </p>
          <p>
            Accurate{" "}
            <strong>
              {correctQuestions.length} / {rows.length * cols.length}
            </strong>
          </p>
          <button
            className="bg-blue-900 text-white rounded border-blue-900 border-2 px-2 py-1 mt-4"
            onClick={hideModal}
          >
            Close
          </button>
        </div>
      </Dialog>
    </main>
  );
}
