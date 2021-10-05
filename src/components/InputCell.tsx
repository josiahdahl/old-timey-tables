import { CellContent } from "./CellContent";
import { CellValue, TimesTableState } from "../hooks/use-times-table";
import { ChangeEvent, useEffect, useRef } from "react";
import { useCell } from "../contexts/times-table.context";

export interface InputCellProps {
  xIdx: number;
  yIdx: number;
}

const numberOnlyRegex = /[^\d]/g;

export function InputCell(props: InputCellProps) {
  const { cell, isFocused, idSeed, state, focus, setValue } = useCell(
    props.xIdx,
    props.yIdx
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (state === TimesTableState.ANSWERING) {
  //     setValue(undefined);
  //   }
  // }, [state]);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    const { value: valueAsString } = ev.currentTarget;
    const validatedValue = valueAsString.replace(numberOnlyRegex, "");
    if (validatedValue !== "") {
      setValue(Number(validatedValue));
    }
  }

  if (!cell) {
    return null;
  }

  const { x, y, answer, isCorrect } = cell;
  if (state === TimesTableState.VALIDATED) {
    const bg =
      typeof answer === "undefined"
        ? "bg-gray-300"
        : isCorrect
        ? "bg-green-500"
        : "bg-red-500";
    return (
      <CellContent>
        <div className={`w-full h-full flex justify-center items-center ${bg}`}>
          {answer}
        </div>
      </CellContent>
    );
  }
  const id = `${x}-${y}-${idSeed}`;
  return (
    <CellContent>
      <label htmlFor={id} className="sr-only">
        {x} times {y}
      </label>
      <input
        id={id}
        name={id}
        className={`w-full h-full text-center`}
        type="text"
        inputMode="numeric"
        value={typeof answer === 'undefined' ? '' : answer}
        onChange={handleChange}
        onFocus={focus}
        ref={inputRef}
      />
    </CellContent>
  );
}
