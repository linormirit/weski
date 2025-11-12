import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SearchFiltersProvider } from "./providers/searchFiltersProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SearchFiltersProvider>
      <App />
    </SearchFiltersProvider>
  </StrictMode>
);
