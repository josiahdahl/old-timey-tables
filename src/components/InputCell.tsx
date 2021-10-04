import { CellContent } from "./CellContent";
import { CellValue } from "../hooks/use-times-table";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export interface InputCellProps {
  cellValue: CellValue;
  idSeed: string;
  cellMode: "input" | "validated";
}

const numberOnlyRegex = /[^\d]/g;

export function InputCell(props: InputCellProps) {
  const inputRef = useRef(null);
  const [value, setValue] = useState<string>("");
  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    const { value: valueAsString } = ev.currentTarget;
    const validatedValue = valueAsString.replace(numberOnlyRegex, "");
    setValue(validatedValue);
    if (validatedValue !== "") {
      props.cellValue.answer = Number(validatedValue);
    }
  }
  useEffect(() => {
    if (props.cellMode === "input") {
      setValue("");
    }
  }, [props.cellMode]);
  const { x, y, answer, isCorrect } = props.cellValue;
  if (props.cellMode === "validated") {
    return (
      <CellContent>
        <div
          className={`w-full h-full flex justify-center items-center ${
            isCorrect ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {answer}
        </div>
      </CellContent>
    );
  }
  const id = `${x}-${y}-${props.idSeed}`;
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
        value={value}
        onChange={handleChange}
        ref={inputRef}
      />
    </CellContent>
  );
}
