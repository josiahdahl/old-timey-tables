import { TimesTable } from "./components/TimesTable";
import { TimesTableProvider } from "./contexts/times-table.context";
import { KeyboardControls } from "./components/KeyboardControls";
import { Results } from "./components/Results";
import { Header } from "./components/Header";
import { TableSettings } from "./components/TableSettings";
import { useState } from "react";

export function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <TimesTableProvider>
      <main className="flex flex-col items-center justify-center min-h-screen">
        <Header />
        <TimesTable />
        <button
          aria-label="Open settings dialog"
          onClick={() => setShowSettings(true)}
        >
          Settings
        </button>
        <TableSettings
          isOpen={showSettings}
          onDismiss={() => setShowSettings(false)}
        />
        <KeyboardControls />
        <Results />
      </main>
    </TimesTableProvider>
  );
}
