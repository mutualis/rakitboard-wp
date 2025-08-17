import AppRouter from "./router/AppRouter";
import { ThemeProvider } from "./components/ThemeProvider";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="rakitboard-theme">
        <AppRouter />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
