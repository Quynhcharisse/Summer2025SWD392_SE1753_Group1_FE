import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import "./index.css";
import { AppRouter } from "./routes/AppRouter";
import { ThemeProvider } from "@contexts/ThemeContext";
import { SnackbarProvider } from "notistack";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
          <AppRouter />
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
