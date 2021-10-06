import { TimesTable } from "./components/TimesTable";
import { TimesTableProvider } from "./contexts/times-table.context";

export function App() {
  return (
    <TimesTableProvider>
      <TimesTable width={12} height={12} />
    </TimesTableProvider>
  );
}
