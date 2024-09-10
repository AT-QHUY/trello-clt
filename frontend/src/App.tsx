import "@mantine/tiptap/styles.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

import { BrowserRouter } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTheme, MantineProvider } from "@mantine/core";
import { SessionProvider } from "./context/AuthContext.tsx";
import AppRoute from "./routes/AppRoute";
import { create } from "zustand";

const theme = createTheme({
  black: "#172b4d",
});
const queryClient = new QueryClient({
  defaultOptions: {},
});

type SearchState = {
  searchValue: string;
};

type SearchAction = {
  updateSearchValue: (value: SearchState["searchValue"]) => void;
};

export const useSearchStore = create<SearchState & SearchAction>((set) => ({
  searchValue: "",
  updateSearchValue: (value: string) => set({ searchValue: value }),
}));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <BrowserRouter>
          <SessionProvider>
            <Notifications position="top-right" limit={5} />
            <ModalsProvider>
              <AppRoute />
            </ModalsProvider>
          </SessionProvider>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
