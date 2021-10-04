import { FC } from "react";

export const CellContent: FC = ({ children }) => {
  return (
    <div className="w-12 h-12 flex justify-center items-center">{children}</div>
  );
};
