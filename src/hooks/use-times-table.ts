import { useCallback, useEffect, useRef, useState } from "react";

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

export interface CellValue {
  x: number;
  y: number;
  answer?: number;
  isCorrect?: boolean;
}

export enum TimesTableState {
  ANSWERING,
  VALIDATED,
}

export function idSeedGenerator() {
  return Date.now().toString(16);
}

/**
 * Generate columns and rows for a times table
 */
export function useTimesTable(width = 12, height = 12) {
  const [rows, setRows] = useState<number[]>([]);
  const [cols, setCols] = useState<number[]>([]);
  const [state, setState] = useState<TimesTableState>(
    TimesTableState.ANSWERING
  );
  const values = useRef<CellValue[]>([]);
  const [idSeed, setIdSeed] = useState(idSeedGenerator());

  const reset = useCallback(() => {
    const rows = createRange(height);
    const cols = createRange(width);
    setRows(rows);
    setCols(cols);
    values.current = createValuesArray(rows, cols);
    setIdSeed(idSeedGenerator());
    setState(TimesTableState.ANSWERING);
  }, [height, width]);

  const setAnswer = useCallback((x: number, y: number, answer: number) => {
    try {
      values.current[x * y].answer = answer;
    } catch (e) {
      console.error("Cannot set value!", e);
    }
  }, []);

  const validate = useCallback(() => {
    for (let i = 0; i < values.current.length; i++) {
      const value = values.current[i];
      value.isCorrect = value.x * value.y === value.answer;
    }
    setState(TimesTableState.VALIDATED);
  }, []);

  useEffect(() => {
    reset();
  }, []);
  return { rows, cols, values, state, reset, setAnswer, validate, idSeed };
}
