import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CellValue, TimesTableState } from "../hooks/use-times-table";

export interface TimesTableContextValue {
  cells: CellValue[];
  rows: number[];
  cols: number[];
  focusedCell: number;
  state: TimesTableState;
  idSeed: string;
  focusCell(index: number): void;
  setCellValue(index: number, value?: number): void;
  reset(height: number, width: number): void;
  validate(): void;
}

export interface UseCell {
  cell: CellValue;
  isFocused: boolean;
  idSeed: string;
  state: TimesTableState;
  focus(): void;
  setValue(value: number | undefined): void;
}

const TimesTableContext = createContext<TimesTableContextValue | undefined>(
  undefined
);

export function useTimesTable(): TimesTableContextValue {
  const context = useContext(TimesTableContext);
  if (typeof context === "undefined") {
    throw new Error("useTimesTable must be used within a TimesTableContext");
  }
  return context;
}

export function useCell(xIndex: number, yIndex: number): UseCell {
  const { cells, focusCell, setCellValue, focusedCell, idSeed, state, cols } =
    useTimesTable();
  const index = cols.length * yIndex + xIndex;
  return {
    cell: cells[index],
    isFocused: focusedCell === index,
    idSeed,
    state,
    focus: () => focusCell(index),
    setValue: (value: number | undefined) => setCellValue(index, value),
  };
}

export function idSeedGenerator() {
  return Date.now().toString(16);
}

/**
 * @future randomize range
 */
function createRange(range: number): number[] {
  return Array(range)
    .fill(0)
    .map((_, i) => i + 1);
}

function createValuesArray(rows: number[], cols: number[]): CellValue[] {
  const values: CellValue[] = [];
  for (const row of rows) {
    for (const col of cols) {
      values.push({ x: col, y: row });
    }
  }
  return values;
}

export const TimesTableProvider: FC = ({ children }) => {
  const [rows, setRows] = useState<number[]>([]);
  const [cols, setCols] = useState<number[]>([]);
  const [state, setState] = useState<TimesTableState>(
    TimesTableState.ANSWERING
  );
  const [cells, setCells] = useState<CellValue[]>([]);
  const [focusedCell, setFocusedCell] = useState<number>(-1);
  const [idSeed, setIdSeed] = useState(idSeedGenerator());

  const reset = useCallback((height: number, width: number) => {
    const rows = createRange(height);
    const cols = createRange(width);
    setRows(rows);
    setCols(cols);
    setCells(createValuesArray(rows, cols));
    setIdSeed(idSeedGenerator());
    setState(TimesTableState.ANSWERING);
  }, []);

  const focusCell = useCallback((index: number) => {
    // Do we need to validate the index here? Probably not
    setFocusedCell(index);
  }, []);

  const setCellValue = useCallback((index: number, value: number) => {
    setCells((cells) => {
      const cell = { ...cells[index] };
      cell.answer = value;
      const newCells = [...cells];
      newCells.splice(index, 1, cell);
      return newCells;
    });
  }, []);

  const validate = useCallback(() => {
    const validatedCells = cells.map((cell) => ({
      ...cell,
      isCorrect:
        typeof cell.answer === "undefined"
          ? undefined
          : cell.answer === cell.x * cell.y,
    }));
    setCells(validatedCells);
    setState(TimesTableState.VALIDATED);
  }, [cells]);

  const value: TimesTableContextValue = {
    cells,
    rows,
    cols,
    focusedCell,
    state,
    idSeed,
    reset,
    focusCell,
    setCellValue,
    validate,
  };

  return (
    <TimesTableContext.Provider value={value}>
      {children}
    </TimesTableContext.Provider>
  );
};
