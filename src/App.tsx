import { TimesTable } from "./components/TimesTable";
import { TimesTableProvider } from "./contexts/times-table.context";
import { KeyboardControls } from "./components/KeyboardControls";
import { Results } from "./components/Results";
import { Header } from "./components/Header";
import { TableSettings } from "./components/TableSettings";
import { useCallback, useState } from "react";

export function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [resultsShown, setResultsShown] = useState(false);
  const showResults = useCallback(() => {
    setResultsShown(state => true);
  }, []);
  const hideResults = useCallback(() => {
    setResultsShown(false);
  }, []);

  return (
    <TimesTableProvider>
      <main className="flex flex-col items-center justify-center min-h-screen">
        <Header />
        <TimesTable showResults={showResults} showSettings={() => setShowSettings(true)}/>
        <TableSettings
          isOpen={showSettings}
          onDismiss={() => setShowSettings(false)}
        />
        <KeyboardControls />
        <Results modalOpen={resultsShown} hideResults={hideResults}/>
      </main>
    </TimesTableProvider>
  );
}
