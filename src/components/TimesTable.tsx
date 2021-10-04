import { FormEvent } from "react";
import { CellContent } from "./CellContent";
import { InputCell } from "./InputCell";
import { TimesTableState, useTimesTable } from "../hooks/use-times-table";

export interface TableProps {
  width: number;
  height: number;
}

export function TimesTable({ width, height }: TableProps) {
  const { rows, cols, values, reset, setAnswer, validate, idSeed, state } =
    useTimesTable(width, height);

  function validateAnswers(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    validate();
  }

  return rows.length === 0 ? null : (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <header className="mb-4 text-center">
        <h1 className="text-2xl font-bold">Times Tables</h1>
        <p>Enter answers below and then check them!</p>
      </header>
      <form onSubmit={validateAnswers}>
        <table>
          <thead>
            <tr>
              <th />
              {cols.map((col) => (
                <th className="border" key={col}>
                  <CellContent>{col}</CellContent>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={row}>
                <td className="border">
                  <CellContent>
                    <strong>{row}</strong>
                  </CellContent>
                </td>
                {cols.map((col, colIdx) => {
                  return (
                    <td key={`${col}-${row}`} className="border">
                      <InputCell
                        cellValue={
                          values.current[colIdx * rows.length + rowIdx]
                        }
                        idSeed={idSeed}
                        cellMode={
                          state === TimesTableState.VALIDATED
                            ? "validated"
                            : "input"
                        }
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
    </main>
  );
}
