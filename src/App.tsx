import { TimesTable } from "./components/TimesTable";
import { TimesTableProvider } from "./contexts/times-table.context";
import { KeyboardControls } from "./components/KeyboardControls";
import { Results } from "./components/Results";

export function App() {
  return (
    <TimesTableProvider>
      <TimesTable width={12} height={12} />
      <KeyboardControls />
      <Results />
    </TimesTableProvider>
  );
}
