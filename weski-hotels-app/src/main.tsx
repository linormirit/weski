import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, MantineProvider } from "@mantine/core";

import "./index.css";
import "@mantine/core/styles.css";

import App from "./App.tsx";
import { SearchFiltersProvider } from "./providers/searchFiltersProvider.tsx";

const theme = createTheme({});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <SearchFiltersProvider>
        <App />
      </SearchFiltersProvider>
    </MantineProvider>
  </StrictMode>
);
