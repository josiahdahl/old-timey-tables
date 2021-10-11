import { Dialog } from "@reach/dialog";
import { TimesTableState, useTimesTable } from "../contexts/times-table.context";
import { useLayoutEffect, useState } from "react";

export function Results() {
  const { cells, rows, cols, state } = useTimesTable();
  const [modalOpen, setModalOpen] = useState(false);
  const completedQuestions = cells.filter(
    (v) => typeof v.answer !== "undefined"
  );
  const correctQuestions = completedQuestions.filter((v) => v.isCorrect);
  const hideModal = () => setModalOpen(false);

  useLayoutEffect( () => {
    if (state === TimesTableState.VALIDATED) {
      setModalOpen(true);
    }
  }, [state])
  return (
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
  );
}
