import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import "./index.css";
import { AppRouter } from "./routes/AppRouter";
import { ThemeProvider } from "@contexts/ThemeContext";
import { SnackbarProvider } from "notistack";
import { AuthProvider } from "@contexts/AuthContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light">
          <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
            <AppRouter />
          </SnackbarProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
