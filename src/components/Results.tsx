import { Dialog } from "@reach/dialog";
import { useTimesTable } from "../contexts/times-table.context";

export interface ResultsProps {
  modalOpen: boolean;
  hideResults: () => void;
}

export function Results({ modalOpen, hideResults }: ResultsProps) {
  const { cells, rows, cols, totalTimeMs } = useTimesTable();
  const completedQuestions = cells.filter(
    (v) => typeof v.answer !== "undefined"
  );
  const correctQuestions = completedQuestions.filter((v) => v.isCorrect);
  const displayTime = (totalTimeMs / 1000).toFixed(3).replace(/0+$/, "");

  return (
    <Dialog
      isOpen={modalOpen}
      onDismiss={hideResults}
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
        <p>
          Total Time <strong>{displayTime} seconds</strong>
        </p>
        <button
          className="bg-blue-900 text-white rounded border-blue-900 border-2 px-2 py-1 mt-4"
          onClick={hideResults}
        >
          Close
        </button>
      </div>
    </Dialog>
  );
}
