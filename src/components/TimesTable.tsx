import { FormEvent, useRef, useState } from "react";
import { CellContent } from "./CellContent";
import { InputCell } from "./InputCell";
import { TimesTableState, useTimesTable } from "../hooks/use-times-table";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import { useOnClickOutside } from "../hooks/use-click-outside";

export interface TableProps {
  width: number;
  height: number;
}

export function TimesTable({ width, height }: TableProps) {
  const { rows, cols, values, reset, setAnswer, validate, idSeed, state } =
    useTimesTable(width, height);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColRow, setSelectedColRow] = useState<{
    x?: number;
    y?: number;
  }>({});
  const tableRef = useRef(null);
  useOnClickOutside(tableRef, () => {
    setSelectedColRow({});
  });

  const showModal = () => setModalOpen(true);
  const hideModal = () => setModalOpen(false);

  function validateAnswers(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    validate();
    showModal();
  }
  function handleFocus(x: number, y: number) {
    setSelectedColRow({ x, y });
  }

  const completedQuestions = values.current.filter(
    (v) => typeof v.answer !== "undefined"
  );
  const correctQuestions = completedQuestions.filter((v) => v.isCorrect);

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
                  <CellContent isHighlighted={selectedColRow.x === colIdx}>
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
                  <CellContent isHighlighted={selectedColRow.y === rowIdx}>
                    <strong>{row}</strong>
                  </CellContent>
                </td>
                {cols.map((col, colIdx) => {
                  return (
                    <td key={`${col}-${row}`} className="border">
                      <InputCell
                        cellValue={
                          values.current[rowIdx * rows.length + colIdx]
                        }
                        idSeed={idSeed}
                        cellMode={
                          state === TimesTableState.VALIDATED
                            ? "validated"
                            : "input"
                        }
                        xIdx={colIdx}
                        yIdx={rowIdx}
                        onFocus={() => handleFocus(colIdx, rowIdx)}
                      />
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
            onClick={reset}
          >
            Reset
          </button>
        </div>
      </form>
      <Dialog isOpen={modalOpen} onDismiss={hideModal}>
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
