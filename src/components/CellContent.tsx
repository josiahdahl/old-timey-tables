import { FC } from "react";

export interface CellContentProps {
  isHighlighted?: boolean;
}

export const CellContent: FC<CellContentProps> = ({
  isHighlighted,
  children,
}) => {
  return (
    <div
      className={`w-12 h-12 flex justify-center items-center ${
        isHighlighted ? "bg-gray-300" : ""
      }`}
    >
      {children}
    </div>
  );
};
